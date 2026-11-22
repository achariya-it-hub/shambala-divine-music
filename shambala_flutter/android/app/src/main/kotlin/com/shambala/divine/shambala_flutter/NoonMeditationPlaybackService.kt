package com.shambala.divine.shambala_flutter

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import java.io.File
import java.io.FileOutputStream
import java.util.Calendar

class NoonMeditationPlaybackService : Service() {

    companion object {
        const val ACTION_START_PLAYBACK = "com.shambala.divine.SERVICE_START_PLAYBACK"
        const val ACTION_PAUSE_PLAYBACK = "com.shambala.divine.SERVICE_PAUSE_PLAYBACK"
        const val ACTION_RESUME_PLAYBACK = "com.shambala.divine.SERVICE_RESUME_PLAYBACK"
        const val ACTION_STOP_PLAYBACK = "com.shambala.divine.SERVICE_STOP_PLAYBACK"
        const val ACTION_SET_VOLUME = "com.shambala.divine.SERVICE_SET_VOLUME"
        const val ACTION_STANDBY = "com.shambala.divine.SERVICE_STANDBY"

        const val EXTRA_DAY_INDEX = "extra_day_index"
        const val EXTRA_DURATION_SEC = "extra_duration_sec"
        const val EXTRA_IS_SIMULATED = "extra_is_simulated"
        const val EXTRA_VOLUME = "extra_volume"
        const val EXTRA_TARGET_EPOCH = "extra_target_epoch"

        private const val PLAYBACK_CHANNEL_ID = "shambala_noon_playback_channel"
        private const val STANDBY_CHANNEL_ID = "shambala_noon_standby_channel"
        private const val NOTIFICATION_ID = 1208

        @Volatile
        var isSessionActive: Boolean = false
            private set

        @Volatile
        var isPlayingNow: Boolean = false
            private set

        @Volatile
        var isStandbyOnly: Boolean = false
            private set

        @Volatile
        var isSimulatedSession: Boolean = false
            private set

        @Volatile
        var activeDayIndex: Int = 1
            private set

        @Volatile
        var sessionEndEpochMillis: Long = 0L
            private set

        @Volatile
        var pausedRemainingSec: Int = 0
            private set

        @Volatile
        var currentVolume: Float = 0.85f

        fun getRemainingSeconds(): Int {
            if (!isSessionActive) return 0
            if (!isPlayingNow && pausedRemainingSec > 0) return pausedRemainingSec
            val diffMs = sessionEndEpochMillis - System.currentTimeMillis()
            return ((diffMs + 999L) / 1000L).toInt().coerceAtLeast(0)
        }

        fun startPlayback(context: Context, dayIndex: Int, durationSec: Int, isSimulated: Boolean) {
            val intent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                action = ACTION_START_PLAYBACK
                putExtra(EXTRA_DAY_INDEX, dayIndex)
                putExtra(EXTRA_DURATION_SEC, durationSec)
                putExtra(EXTRA_IS_SIMULATED, isSimulated)
            }
            ContextCompat.startForegroundService(context, intent)
        }

        fun togglePauseResume(context: Context) {
            if (!isSessionActive) return
            val intent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                action = if (isPlayingNow) ACTION_PAUSE_PLAYBACK else ACTION_RESUME_PLAYBACK
            }
            context.startService(intent)
        }

        fun pausePlayback(context: Context) {
            if (!isSessionActive) return
            val intent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                action = ACTION_PAUSE_PLAYBACK
            }
            context.startService(intent)
        }

        fun resumePlayback(context: Context) {
            if (!isSessionActive) return
            val intent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                action = ACTION_RESUME_PLAYBACK
            }
            context.startService(intent)
        }

        fun updateVolume(context: Context, vol: Float) {
            currentVolume = vol.coerceIn(0f, 1f)
            if (!isSessionActive) return
            val intent = Intent(context, NoonMeditationPlaybackService::class.java).apply {
                action = ACTION_SET_VOLUME
                putExtra(EXTRA_VOLUME, currentVolume)
            }
            context.startService(intent)
        }

        fun stopService(context: Context) {
            try {
                context.stopService(Intent(context, NoonMeditationPlaybackService::class.java))
            } catch (_: Exception) {
            }
            isSessionActive = false
            isPlayingNow = false
            isStandbyOnly = false
        }
    }

    private var mediaPlayer: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private var audioFocusRequest: AudioFocusRequest? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    private val stopSessionRunnable = Runnable {
        stopPlaybackAndSelf()
    }

    private val standbyTriggerRunnable = Runnable {
        if (NoonMeditationScheduler.isScheduledEnabled(applicationContext) &&
            !NoonMeditationScheduler.isDismissedToday(applicationContext)
        ) {
            val dayIdx = NoonMeditationScheduler.calendarDayToIsoWeekday(
                Calendar.getInstance().get(Calendar.DAY_OF_WEEK)
            )
            handleStartPlayback(dayIdx, 360, false)
            NoonMeditationScheduler.scheduleNextNoonAlarm(applicationContext, allowStandbyService = false)
        } else {
            stopPlaybackAndSelf()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        ensureNotificationChannels()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_START_PLAYBACK

        when (action) {
            ACTION_START_PLAYBACK -> {
                val defaultDay = NoonMeditationScheduler.calendarDayToIsoWeekday(
                    Calendar.getInstance().get(Calendar.DAY_OF_WEEK)
                )
                val dayIndex = intent?.getIntExtra(EXTRA_DAY_INDEX, defaultDay) ?: defaultDay
                val durationSec = intent?.getIntExtra(EXTRA_DURATION_SEC, 360) ?: 360
                val simulated = intent?.getBooleanExtra(EXTRA_IS_SIMULATED, false) ?: false

                // Idempotent check: if the exact scheduled noon session is already playing, don't restart from 0:00
                if (isSessionActive && isPlayingNow && !simulated && !isSimulatedSession && activeDayIndex == dayIndex) {
                    promoteForeground(buildPlaybackNotification(dayIndex, playing = true))
                    return START_STICKY
                }
                handleStartPlayback(dayIndex, durationSec, simulated)
            }

            ACTION_PAUSE_PLAYBACK -> {
                handlePausePlayback()
            }

            ACTION_RESUME_PLAYBACK -> {
                handleResumePlayback()
            }

            ACTION_SET_VOLUME -> {
                val vol = intent?.getFloatExtra(EXTRA_VOLUME, currentVolume) ?: currentVolume
                currentVolume = vol.coerceIn(0f, 1f)
                mediaPlayer?.setVolume(currentVolume, currentVolume)
            }

            ACTION_STOP_PLAYBACK -> {
                stopPlaybackAndSelf()
            }

            ACTION_STANDBY -> {
                if (!isSessionActive) {
                    isStandbyOnly = true
                    val targetEpoch = intent?.getLongExtra(
                        EXTRA_TARGET_EPOCH,
                        NoonMeditationScheduler.nextNoonEpochMillis()
                    ) ?: NoonMeditationScheduler.nextNoonEpochMillis()
                    promoteForeground(buildStandbyNotification())
                    mainHandler.removeCallbacks(standbyTriggerRunnable)
                    val delayMs = (targetEpoch - System.currentTimeMillis()).coerceAtLeast(1000L)
                    mainHandler.postDelayed(standbyTriggerRunnable, delayMs)
                }
            }
        }

        return START_STICKY
    }

    private fun handleStartPlayback(dayIndex: Int, durationSec: Int, simulated: Boolean) {
        mainHandler.removeCallbacks(standbyTriggerRunnable)
        mainHandler.removeCallbacks(stopSessionRunnable)

        isStandbyOnly = false
        isSessionActive = true
        isSimulatedSession = simulated
        activeDayIndex = dayIndex.coerceIn(1, 7)
        pausedRemainingSec = 0
        sessionEndEpochMillis = System.currentTimeMillis() + (durationSec * 1000L)

        promoteForeground(buildPlaybackNotification(activeDayIndex, playing = true))
        acquireWakeLock((durationSec + 30) * 1000L)
        requestAudioFocus()

        startMediaPlayerForDay(activeDayIndex)
        mainHandler.postDelayed(stopSessionRunnable, durationSec * 1000L)
    }

    private fun startMediaPlayerForDay(dayIndex: Int) {
        releaseMediaPlayerOnly()

        val fileName = when (dayIndex) {
            1 -> "meditation_monday.mp3"
            2 -> "meditation_tuesday.mp3"
            3 -> "meditation_wednesday.mp3"
            4 -> "meditation_thursday.mp3"
            5 -> "meditation_friday.mp3"
            6 -> "meditation_saturday.mp3"
            7 -> "meditation_sunday.mp3"
            else -> "meditation_monday.mp3"
        }
        val assetKey = "flutter_assets/assets/audio/$fileName"

        val mp = MediaPlayer()
        val attrs = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
            .build()
        mp.setAudioAttributes(attrs)
        mp.setWakeMode(applicationContext, PowerManager.PARTIAL_WAKE_LOCK)
        mp.isLooping = true
        mp.setVolume(currentVolume, currentVolume)

        try {
            try {
                applicationContext.assets.openFd(assetKey).use { afd ->
                    mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                }
            } catch (_: Exception) {
                // Fallback if APK/AAB compressed the asset: stream once to cacheDir
                val cachedFile = File(applicationContext.cacheDir, fileName)
                if (!cachedFile.exists() || cachedFile.length() == 0L) {
                    applicationContext.assets.open(assetKey).use { input ->
                        FileOutputStream(cachedFile).use { output ->
                            input.copyTo(output)
                        }
                    }
                }
                mp.setDataSource(cachedFile.absolutePath)
            }

            mp.prepare()
            mp.start()
            mediaPlayer = mp
            isPlayingNow = true
        } catch (e: Exception) {
            e.printStackTrace()
            isPlayingNow = false
        }
    }

    private fun handlePausePlayback() {
        if (!isSessionActive) return
        try {
            if (mediaPlayer?.isPlaying == true) {
                pausedRemainingSec = getRemainingSeconds()
                mediaPlayer?.pause()
            }
            isPlayingNow = false
            mainHandler.removeCallbacks(stopSessionRunnable)
            promoteForeground(buildPlaybackNotification(activeDayIndex, playing = false))
        } catch (_: Exception) {
        }
    }

    private fun handleResumePlayback() {
        if (!isSessionActive) return
        try {
            val remSec = if (pausedRemainingSec > 0) pausedRemainingSec else 360
            sessionEndEpochMillis = System.currentTimeMillis() + (remSec * 1000L)
            pausedRemainingSec = 0
            if (mediaPlayer == null) {
                startMediaPlayerForDay(activeDayIndex)
            } else {
                mediaPlayer?.setVolume(currentVolume, currentVolume)
                mediaPlayer?.start()
                isPlayingNow = true
            }
            mainHandler.removeCallbacks(stopSessionRunnable)
            mainHandler.postDelayed(stopSessionRunnable, remSec * 1000L)
            promoteForeground(buildPlaybackNotification(activeDayIndex, playing = true))
        } catch (_: Exception) {
        }
    }

    private fun stopPlaybackAndSelf() {
        mainHandler.removeCallbacks(stopSessionRunnable)
        mainHandler.removeCallbacks(standbyTriggerRunnable)
        releaseMediaPlayerOnly()
        abandonAudioFocus()
        releaseWakeLock()
        isSessionActive = false
        isPlayingNow = false
        isStandbyOnly = false
        pausedRemainingSec = 0
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } else {
            @Suppress("DEPRECATION")
            stopForeground(true)
        }
        stopSelf()
    }

    private fun releaseMediaPlayerOnly() {
        try {
            mediaPlayer?.let { mp ->
                if (mp.isPlaying) {
                    mp.stop()
                }
                mp.reset()
                mp.release()
            }
        } catch (_: Exception) {
        } finally {
            mediaPlayer = null
        }
    }

    private fun requestAudioFocus() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val attrs = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build()
            val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                .setAudioAttributes(attrs)
                .setAcceptsDelayedFocusGain(true)
                .setOnAudioFocusChangeListener { change ->
                    if (change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                        mediaPlayer?.setVolume(currentVolume * 0.25f, currentVolume * 0.25f)
                    } else if (change == AudioManager.AUDIOFOCUS_GAIN) {
                        mediaPlayer?.setVolume(currentVolume, currentVolume)
                    }
                }
                .build()
            audioFocusRequest = req
            audioManager.requestAudioFocus(req)
        } else {
            @Suppress("DEPRECATION")
            audioManager.requestAudioFocus(
                null,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN
            )
        }
    }

    private fun abandonAudioFocus() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            audioFocusRequest?.let { audioManager.abandonAudioFocusRequest(it) }
        }
        audioFocusRequest = null
    }

    private fun acquireWakeLock(timeoutMs: Long) {
        releaseWakeLock()
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "HappyShambala:MeditationPlaybackLock"
        ).apply {
            setReferenceCounted(false)
            acquire(timeoutMs)
        }
    }

    private fun releaseWakeLock() {
        try {
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (_: Exception) {
        } finally {
            wakeLock = null
        }
    }

    private fun promoteForeground(notification: Notification) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun dayTitle(dayIndex: Int): String {
        return when (dayIndex) {
            1 -> "Monday • Sacred Om 108 Chants"
            2 -> "Tuesday • Cosmic Krishna Flute"
            3 -> "Wednesday • Shiva Tandava & Bowl"
            4 -> "Thursday • Guru Divine Chants"
            5 -> "Friday • Divine Mother Shakti Stuti"
            6 -> "Saturday • 432Hz Chakra Alignment"
            7 -> "Sunday • Surya Gayatri Light"
            else -> "12:00 Noon Meditation"
        }
    }

    private fun buildPlaybackNotification(dayIndex: Int, playing: Boolean): Notification {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val openAppPending = PendingIntent.getActivity(
            this,
            2001,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val toggleIntent = Intent(this, NoonMeditationAlarmReceiver::class.java).apply {
            action = NoonMeditationScheduler.ACTION_TOGGLE_PAUSE_NOON
        }
        val togglePending = PendingIntent.getBroadcast(
            this,
            2002,
            toggleIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val stopIntent = Intent(this, NoonMeditationAlarmReceiver::class.java).apply {
            action = NoonMeditationScheduler.ACTION_STOP_NOON
        }
        val stopPending = PendingIntent.getBroadcast(
            this,
            2003,
            stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, PLAYBACK_CHANNEL_ID)
            .setSmallIcon(R.mipmap.launcher_icon)
            .setContentTitle("🕉️ 12:00 Noon Meditation")
            .setContentText(if (playing) "Playing: ${dayTitle(dayIndex)}" else "Paused: ${dayTitle(dayIndex)}")
            .setContentIntent(openAppPending)
            .setFullScreenIntent(openAppPending, true)
            .setOngoing(playing)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setCategory(NotificationCompat.CATEGORY_TRANSPORT)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setSilent(true)
            .addAction(
                android.R.drawable.ic_media_pause,
                if (playing) "Pause" else "Resume",
                togglePending
            )
            .addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                "Stop",
                stopPending
            )
            .build()
    }

    private fun buildStandbyNotification(): Notification {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val openAppPending = PendingIntent.getActivity(
            this,
            2004,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, STANDBY_CHANNEL_ID)
            .setSmallIcon(R.mipmap.launcher_icon)
            .setContentTitle("Happy Shambala • 12 Noon Meditation")
            .setContentText("Scheduled to play automatically at 12:00 PM")
            .setContentIntent(openAppPending)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun ensureNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val playbackChannel = NotificationChannel(
                PLAYBACK_CHANNEL_ID,
                "12 Noon Meditation Playback",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Plays the daily 6-minute 12:00 Noon meditation automatically"
                setSound(null, null)
                enableVibration(false)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }
            nm.createNotificationChannel(playbackChannel)

            val standbyChannel = NotificationChannel(
                STANDBY_CHANNEL_ID,
                "12 Noon Meditation Standby",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps 12:00 Noon meditation ready when exact alarm permission is off"
                setSound(null, null)
                enableVibration(false)
            }
            nm.createNotificationChannel(standbyChannel)
        }
    }

    override fun onDestroy() {
        mainHandler.removeCallbacks(stopSessionRunnable)
        mainHandler.removeCallbacks(standbyTriggerRunnable)
        releaseMediaPlayerOnly()
        abandonAudioFocus()
        releaseWakeLock()
        isSessionActive = false
        isPlayingNow = false
        isStandbyOnly = false
        super.onDestroy()
    }
}
