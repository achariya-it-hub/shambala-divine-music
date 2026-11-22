package com.shambala.divine.shambala_flutter

import android.app.AlarmManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.PowerManager
import java.util.Calendar

class NoonMeditationAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val action = intent?.action ?: return

        when (action) {
            NoonMeditationScheduler.ACTION_TRIGGER_NOON -> {
                if (!NoonMeditationScheduler.isScheduledEnabled(context)) return

                val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
                val wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK,
                    "HappyShambala:NoonAlarmReceiverLock"
                )
                wakeLock.acquire(15_000L)

                try {
                    if (!NoonMeditationScheduler.isDismissedToday(context)) {
                        val now = Calendar.getInstance()
                        val dayIndex = NoonMeditationScheduler.calendarDayToIsoWeekday(
                            now.get(Calendar.DAY_OF_WEEK)
                        )
                        NoonMeditationPlaybackService.startPlayback(
                            context = context,
                            dayIndex = dayIndex,
                            durationSec = 360,
                            isSimulated = false
                        )
                    }
                    // Always arm tomorrow's 12:00 PM alarm
                    NoonMeditationScheduler.scheduleNextNoonAlarm(context, allowStandbyService = false)
                } finally {
                    if (wakeLock.isHeld) {
                        try {
                            wakeLock.release()
                        } catch (_: Exception) {
                        }
                    }
                }
            }

            NoonMeditationScheduler.ACTION_STOP_NOON -> {
                val now = Calendar.getInstance()
                if (now.get(Calendar.HOUR_OF_DAY) == 12 && now.get(Calendar.MINUTE) in 0..5) {
                    NoonMeditationScheduler.markDismissedToday(context)
                }
                NoonMeditationPlaybackService.stopService(context)
            }

            NoonMeditationScheduler.ACTION_TOGGLE_PAUSE_NOON -> {
                NoonMeditationPlaybackService.togglePauseResume(context)
            }

            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_LOCKED_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            Intent.ACTION_TIME_CHANGED,
            Intent.ACTION_TIMEZONE_CHANGED,
            AlarmManager.ACTION_SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED -> {
                if (NoonMeditationScheduler.isScheduledEnabled(context)) {
                    NoonMeditationScheduler.scheduleNextNoonAlarm(context, allowStandbyService = false)
                }
            }
        }
    }
}
