package com.shambala.divine.shambala_flutter

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val channelName = "com.shambala.divine/noon_meditation"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, channelName)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "syncSchedule" -> {
                        val enabled = call.argument<Boolean>("enabled") ?: true
                        val requestPermission = call.argument<Boolean>("requestPermission") ?: false
                        val prefs = applicationContext.getSharedPreferences("shambala_noon_prefs", Context.MODE_PRIVATE)
                        val alreadyPrompted = prefs.getBoolean("prompted_exact_once", false)

                        if (enabled && (requestPermission || !alreadyPrompted)) {
                            prefs.edit().putBoolean("prompted_exact_once", true).apply()
                            requestExactAlarmAndBatteryIfNeeded()
                        }

                        NoonMeditationScheduler.setScheduledEnabled(
                            context = applicationContext,
                            enabled = enabled,
                            fromForeground = true
                        )
                        result.success(
                            mapOf(
                                "canScheduleExact" to NoonMeditationScheduler.canScheduleExact(applicationContext),
                                "enabled" to enabled
                            )
                        )
                    }

                    "startPlayback" -> {
                        val dayIndex = call.argument<Int>("dayIndex") ?: 1
                        val durationSec = call.argument<Int>("durationSec") ?: 360
                        val isSimulated = call.argument<Boolean>("isSimulated") ?: false
                        val vol = (call.argument<Double>("volume") ?: 0.85).toFloat()
                        NoonMeditationPlaybackService.currentVolume = vol.coerceIn(0f, 1f)
                        NoonMeditationPlaybackService.startPlayback(
                            context = applicationContext,
                            dayIndex = dayIndex,
                            durationSec = durationSec,
                            isSimulated = isSimulated
                        )
                        result.success(true)
                    }

                    "pausePlayback" -> {
                        NoonMeditationPlaybackService.pausePlayback(applicationContext)
                        result.success(true)
                    }

                    "resumePlayback" -> {
                        NoonMeditationPlaybackService.resumePlayback(applicationContext)
                        result.success(true)
                    }

                    "setVolume" -> {
                        val vol = (call.argument<Double>("volume") ?: 0.85).toFloat()
                        NoonMeditationPlaybackService.updateVolume(applicationContext, vol)
                        result.success(true)
                    }

                    "stopPlayback" -> {
                        val markDismissed = call.argument<Boolean>("markDismissed") ?: false
                        if (markDismissed) {
                            NoonMeditationScheduler.markDismissedToday(applicationContext)
                        }
                        NoonMeditationPlaybackService.stopService(applicationContext)
                        result.success(true)
                    }

                    "getStatus" -> {
                        result.success(
                            mapOf(
                                "isSessionActive" to NoonMeditationPlaybackService.isSessionActive,
                                "isPlaying" to NoonMeditationPlaybackService.isPlayingNow,
                                "isSimulated" to NoonMeditationPlaybackService.isSimulatedSession,
                                "dayIndex" to NoonMeditationPlaybackService.activeDayIndex,
                                "remainingSec" to NoonMeditationPlaybackService.getRemainingSeconds(),
                                "canScheduleExact" to NoonMeditationScheduler.canScheduleExact(applicationContext)
                            )
                        )
                    }

                    else -> result.notImplemented()
                }
            }
    }

    private fun requestExactAlarmAndBatteryIfNeeded() {
        // 1. Android 12+ Exact Alarm permission ("Alarms & reminders")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !NoonMeditationScheduler.canScheduleExact(this)) {
            try {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = Uri.parse("package:$packageName")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(intent)
                return
            } catch (_: Exception) {
            }
        }

        // 2. Ignore Battery Optimizations so OEM battery killers don't throttle background playback
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
                if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                    val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:$packageName")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    startActivity(intent)
                }
            } catch (_: Exception) {
            }
        }
    }
}
