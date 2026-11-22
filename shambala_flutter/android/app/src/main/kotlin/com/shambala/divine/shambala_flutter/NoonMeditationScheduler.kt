package com.shambala.divine.shambala_flutter

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object NoonMeditationScheduler {
    const val ACTION_TRIGGER_NOON = "com.shambala.divine.ACTION_TRIGGER_NOON"
    const val ACTION_STOP_NOON = "com.shambala.divine.ACTION_STOP_NOON"
    const val ACTION_TOGGLE_PAUSE_NOON = "com.shambala.divine.ACTION_TOGGLE_PAUSE_NOON"

    private const val FLUTTER_PREFS = "FlutterSharedPreferences"
    private const val FLUTTER_KEY_SCHEDULED = "flutter.is_daily_meditation_scheduled"
    private const val NATIVE_PREFS = "shambala_noon_prefs"
    private const val KEY_ENABLED = "enabled"
    private const val KEY_DISMISSED_DATE = "dismissed_date"
    private const val ALARM_REQUEST_CODE = 1200

    fun todayDateKey(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    }

    fun isScheduledEnabled(context: Context): Boolean {
        val nativePrefs = context.getSharedPreferences(NATIVE_PREFS, Context.MODE_PRIVATE)
        if (nativePrefs.contains(KEY_ENABLED)) {
            return nativePrefs.getBoolean(KEY_ENABLED, true)
        }
        val flutterPrefs = context.getSharedPreferences(FLUTTER_PREFS, Context.MODE_PRIVATE)
        return flutterPrefs.getBoolean(FLUTTER_KEY_SCHEDULED, true)
    }

    fun isDismissedToday(context: Context): Boolean {
        val nativePrefs = context.getSharedPreferences(NATIVE_PREFS, Context.MODE_PRIVATE)
        return nativePrefs.getString(KEY_DISMISSED_DATE, null) == todayDateKey()
    }

    fun markDismissedToday(context: Context) {
        context.getSharedPreferences(NATIVE_PREFS, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_DISMISSED_DATE, todayDateKey())
            .apply()
    }

    fun clearDismissedToday(context: Context) {
        context.getSharedPreferences(NATIVE_PREFS, Context.MODE_PRIVATE)
            .edit()
            .remove(KEY_DISMISSED_DATE)
            .apply()
    }

    fun canScheduleExact(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return alarmManager.canScheduleExactAlarms()
    }

    fun setScheduledEnabled(context: Context, enabled: Boolean, fromForeground: Boolean = false) {
        context.getSharedPreferences(NATIVE_PREFS, Context.MODE_PRIVATE)
            .edit()
            .putBoolean(KEY_ENABLED, enabled)
            .apply()
        context.getSharedPreferences(FLUTTER_PREFS, Context.MODE_PRIVATE)
            .edit()
            .putBoolean(FLUTTER_KEY_SCHEDULED, enabled)
            .apply()

        if (enabled) {
            clearDismissedToday(context)
            scheduleNextNoonAlarm(context, allowStandbyService = fromForeground)
        } else {
            cancelNoonAlarm(context)
            NoonMeditationPlaybackService.stopService(context)
        }
    }

    fun cancelNoonAlarm(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, NoonMeditationAlarmReceiver::class.java).apply {
            action = ACTION_TRIGGER_NOON
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            ALARM_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
    }

    fun nextNoonEpochMillis(): Long {
        val now = Calendar.getInstance()
        val target = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 12)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        if (!target.after(now)) {
            target.add(Calendar.DAY_OF_YEAR, 1)
        }
        return target.timeInMillis
    }

    fun scheduleNextNoonAlarm(context: Context, allowStandbyService: Boolean = false) {
        if (!isScheduledEnabled(context)) return

        val now = Calendar.getInstance()
        val hour = now.get(Calendar.HOUR_OF_DAY)
        val minute = now.get(Calendar.MINUTE)
        val second = now.get(Calendar.SECOND)

        // If toggled ON right during 12:00:00 - 12:05:50 and not dismissed today, start immediately
        if (allowStandbyService && hour == 12 && minute in 0..5 && !(minute == 5 && second > 50) && !isDismissedToday(context)) {
            if (!NoonMeditationPlaybackService.isSessionActive) {
                val remainingSec = (6 * 60) - (minute * 60 + second)
                NoonMeditationPlaybackService.startPlayback(
                    context = context,
                    dayIndex = calendarDayToIsoWeekday(now.get(Calendar.DAY_OF_WEEK)),
                    durationSec = remainingSec.coerceAtLeast(15),
                    isSimulated = false
                )
            }
        }

        val triggerAtMillis = nextNoonEpochMillis()
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val triggerIntent = Intent(context, NoonMeditationAlarmReceiver::class.java).apply {
            action = ACTION_TRIGGER_NOON
        }
        val triggerPendingIntent = PendingIntent.getBroadcast(
            context,
            ALARM_REQUEST_CODE,
            triggerIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val showAppIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val showAppPendingIntent = PendingIntent.getActivity(
            context,
            ALARM_REQUEST_CODE + 1,
            showAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (canScheduleExact(context)) {
            try {
                val alarmClockInfo = AlarmManager.AlarmClockInfo(triggerAtMillis, showAppPendingIntent)
                alarmManager.setAlarmClock(alarmClockInfo, triggerPendingIntent)
                // Stop standby service if running (not playing active session) since exact AlarmClock is armed
                if (NoonMeditationPlaybackService.isStandbyOnly) {
                    NoonMeditationPlaybackService.stopService(context)
                }
                return
            } catch (_: SecurityException) {
                // Fall through to fallback below
            }
        }

        // Fallback when exact alarm permission is not yet granted by OS
        alarmManager.setAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            triggerPendingIntent
        )
        if (allowStandbyService && !NoonMeditationPlaybackService.isSessionActive) {
            try {
                val svcIntent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                    action = NoonMeditationPlaybackService.ACTION_STANDBY
                    putExtra(NoonMeditationPlaybackService.EXTRA_TARGET_EPOCH, triggerAtMillis)
                }
                ContextCompat.startForegroundService(context, svcIntent)
            } catch (_: Exception) {
            }
        }
    }

    fun calendarDayToIsoWeekday(calDay: Int): Int {
        return when (calDay) {
            Calendar.MONDAY -> 1
            Calendar.TUESDAY -> 2
            Calendar.WEDNESDAY -> 3
            Calendar.THURSDAY -> 4
            Calendar.FRIDAY -> 5
            Calendar.SATURDAY -> 6
            Calendar.SUNDAY -> 7
            else -> 1
        }
    }
}
