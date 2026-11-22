import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

import '../models/song.dart';
import '../models/meditation.dart';
import '../models/podcast.dart';
import '../models/live_stream.dart';
import '../data/initial_data.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

class MusicProvider extends ChangeNotifier with WidgetsBindingObserver {
  static const MethodChannel _noonAndroidChannel = MethodChannel('com.shambala.divine/noon_meditation');
  bool _usingNativeAndroidPlayer = false;

  // Datasets
  List<Song> songs = List.from(initialSongs);
  List<PodcastShow> podcasts = List.from(initialPodcasts);
  LiveStreamFeed liveFeed = initialLiveFeed;
  List<MeditationTrack> meditationSchedule = List.from(initialMeditationSchedule);

  // Audio Player Engine
  final AudioPlayer _audioPlayer = AudioPlayer();
  Song? currentTrack;
  bool isPlaying = false;
  Duration position = Duration.zero;
  Duration duration = Duration.zero;
  double volume = 0.85;
  bool isMuted = false;
  String repeatMode = 'off'; // 'off' | 'track' | 'all'
  bool isShuffle = false;

  // Sleep Timer State
  int? sleepTimerMinutes;
  Timer? _sleepTimer;

  void setSleepTimer(int? minutes) {
    _sleepTimer?.cancel();
    sleepTimerMinutes = minutes;
    if (minutes != null && minutes > 0) {
      _sleepTimer = Timer(Duration(minutes: minutes), () {
        if (isPlaying) {
          togglePlay();
        }
        sleepTimerMinutes = null;
        notifyListeners();
      });
    }
    notifyListeners();
  }

  void cancelSleepTimer() {
    _sleepTimer?.cancel();
    sleepTimerMinutes = null;
    notifyListeners();
  }

  // Queue
  List<Song> queue = [];
  int queueIndex = 0;

  // Search & Navigation
  String searchQuery = '';
  String selectedCategory = 'All';

  // Theme State & Color Schemes
  bool isDarkMode = false;
  String currentThemeId = 'light';

  final List<Map<String, dynamic>> appThemes = const [
    {
      'id': 'light',
      'name': 'Divine Light',
      'subtitle': 'Warm Cream & Solar Gold',
      'isLight': true,
      'scaffoldBg': Color(0xFFFFF8F0),
      'surfaceBg': Color(0xFFFFFFFF),
      'primary': Color(0xFFFACC15),
      'secondary': Color(0xFFE11D48),
      'onSurface': Color(0xFF1E1B4B),
      'emoji': '☀️',
    },
    {
      'id': 'dark',
      'name': 'Midnight Divine',
      'subtitle': 'Cosmic Crimson & Imperial Gold',
      'isLight': false,
      'scaffoldBg': Color(0xFF0A0713),
      'surfaceBg': Color(0xFF13091B),
      'primary': Color(0xFFFACC15),
      'secondary': Color(0xFFE11D48),
      'onSurface': Color(0xFFFFFFFF),
      'emoji': '🌙',
    },
    {
      'id': 'saffron',
      'name': 'Sacred Saffron',
      'subtitle': 'Vedic Marigold & Terracotta',
      'isLight': false,
      'scaffoldBg': Color(0xFF160803),
      'surfaceBg': Color(0xFF250F06),
      'primary': Color(0xFFFF9933),
      'secondary': Color(0xFFEA580C),
      'onSurface': Color(0xFFFFF7ED),
      'emoji': '🪔',
    },
    {
      'id': 'vrindavan',
      'name': 'Vrindavan Emerald',
      'subtitle': 'Peacock Teal & Flute Gold',
      'isLight': false,
      'scaffoldBg': Color(0xFF031311),
      'surfaceBg': Color(0xFF06231E),
      'primary': Color(0xFF10B981),
      'secondary': Color(0xFFFBBF24),
      'onSurface': Color(0xFFECFDF5),
      'emoji': '🦚',
    },
    {
      'id': 'kailash',
      'name': 'Kailash Sapphire',
      'subtitle': 'Himalayan Blue & Silver Cyan',
      'isLight': false,
      'scaffoldBg': Color(0xFF040B16),
      'surfaceBg': Color(0xFF0A162B),
      'primary': Color(0xFF38BDF8),
      'secondary': Color(0xFF6366F1),
      'onSurface': Color(0xFFF0F9FF),
      'emoji': '🏔️',
    },
    {
      'id': 'lotus',
      'name': 'Lotus Rose Bliss',
      'subtitle': 'Mahalakshmi Rose & Pearl Light',
      'isLight': true,
      'scaffoldBg': Color(0xFFFFF1F5),
      'surfaceBg': Color(0xFFFFFFFF),
      'primary': Color(0xFFE11D48),
      'secondary': Color(0xFFDB2777),
      'onSurface': Color(0xFF3B0722),
      'emoji': '🪷',
    },
  ];

  Map<String, dynamic> get currentTheme {
    return appThemes.firstWhere(
      (t) => t['id'] == currentThemeId,
      orElse: () => appThemes.first,
    );
  }

  String get currentThemeName => currentTheme['name'] as String;
  Color get themeScaffoldBg => currentTheme['scaffoldBg'] as Color;
  Color get themeSurfaceBg => currentTheme['surfaceBg'] as Color;
  Color get themePrimary => currentTheme['primary'] as Color;
  Color get themeSecondary => currentTheme['secondary'] as Color;
  Color get themeText => currentTheme['onSurface'] as Color;
  Color get themeSubtitle => isDarkMode
      ? (currentTheme['onSurface'] as Color).withValues(alpha: 0.72)
      : (currentThemeId == 'lotus' ? const Color(0xFF701A46) : const Color(0xFF475569));

  void setAppTheme(String themeId) async {
    final found = appThemes.firstWhere(
      (t) => t['id'] == themeId,
      orElse: () => appThemes.first,
    );
    currentThemeId = found['id'] as String;
    isDarkMode = !(found['isLight'] as bool);
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('shambala_app_theme', currentThemeId);
    } catch (_) {}
  }

  void toggleTheme() {
    final idx = appThemes.indexWhere((t) => t['id'] == currentThemeId);
    final nextIdx = (idx + 1) % appThemes.length;
    setAppTheme(appThemes[nextIdx]['id'] as String);
  }

  // Offline Caching State
  bool isOfflineMode = false;
  List<Song> offlineSongs = [];

  // Automated 12:00 PM - 12:06 PM Meditation Engine
  bool isMeditationActive = false;
  bool isMeditationSimulated = false;
  String? _dismissedNoonDate;
  MeditationTrack? activeMeditationTrack;
  int meditationTimeRemaining = 360;
  Timer? _noonTimer;
  Timer? _meditationCountdownTimer;

  bool isDailyMeditationScheduled = true;

  MusicProvider() {
    WidgetsBinding.instance.addObserver(this);
    currentTrack = songs.isNotEmpty ? songs.first : null;
    queue = List.from(songs);
    _initAudioListeners();
    _initOfflineCache();
    _startNoonTimer();
    _initNotifications();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _syncFromNativeAndroidStatus();
      _checkNoonWindow();
      if (isDailyMeditationScheduled && !kIsWeb) {
        if (Platform.isAndroid) {
          _syncBackgroundKeepAlive(requestPermission: false);
        } else {
          _scheduleDailyNoonNotification();
        }
      }
    }
  }

  Future<void> _initNotifications() async {
    if (kIsWeb) {
      _initScheduler();
      return;
    }
    tz.initializeTimeZones();
    
    const AndroidInitializationSettings initializationSettingsAndroid = AndroidInitializationSettings('@mipmap/launcher_icon');
    const DarwinInitializationSettings initializationSettingsDarwin = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsDarwin,
    );
    
    try {
      await flutterLocalNotificationsPlugin.initialize(
        initializationSettings,
        onDidReceiveNotificationResponse: (NotificationResponse response) {
          if (response.payload == 'daily_meditation') {
            final dayIdx = DateTime.now().weekday;
            triggerMeditationSimulation(dayIdx);
          }
        },
      );

      final androidPlugin = flutterLocalNotificationsPlugin
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
      if (androidPlugin != null) {
        try {
          await androidPlugin.requestNotificationsPermission();
        } catch (_) {}
        try {
          await androidPlugin.requestExactAlarmsPermission();
        } catch (_) {}
      }

      final launchDetails = await flutterLocalNotificationsPlugin.getNotificationAppLaunchDetails();
      if (launchDetails != null &&
          launchDetails.didNotificationLaunchApp &&
          launchDetails.notificationResponse?.payload == 'daily_meditation') {
        triggerMeditationSimulation(DateTime.now().weekday);
      }
    } catch (e) {
      debugPrint('Notification init notice: $e');
    }

    await _initScheduler();
  }

  Future<void> _initScheduler() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.containsKey('shambala_app_theme')) {
      final savedThemeId = prefs.getString('shambala_app_theme');
      if (savedThemeId != null) {
        final found = appThemes.firstWhere(
          (t) => t['id'] == savedThemeId,
          orElse: () => appThemes.first,
        );
        currentThemeId = found['id'] as String;
        isDarkMode = !(found['isLight'] as bool);
      }
    }
    if (prefs.containsKey('is_daily_meditation_scheduled')) {
      isDailyMeditationScheduled = prefs.getBool('is_daily_meditation_scheduled')!;
    }
    
    if (isDailyMeditationScheduled && !kIsWeb && !Platform.isAndroid) {
      await _scheduleDailyNoonNotification();
    }
    await _syncBackgroundKeepAlive(requestPermission: false);
    await _syncFromNativeAndroidStatus();
    _checkNoonWindow();
    notifyListeners();
  }

  Future<void> _scheduleDailyNoonNotification() async {
    if (kIsWeb) return;
    try {
      final DateTime localNow = DateTime.now();
      DateTime localNoon = DateTime(localNow.year, localNow.month, localNow.day, 12, 0, 0);
      if (!localNoon.isAfter(localNow)) {
        localNoon = localNoon.add(const Duration(days: 1));
      }
      final Duration delayUntilNoon = localNoon.difference(localNow);
      final tz.TZDateTime scheduledDate = tz.TZDateTime.now(tz.UTC).add(delayUntilNoon);

      const AndroidNotificationDetails androidPlatformChannelSpecifics = AndroidNotificationDetails(
        'meditation_noon_alarm_v2',
        'Daily 12:00 PM Meditation',
        channelDescription: 'Automatic 12:00 PM Daily Meditation Session',
        importance: Importance.max,
        priority: Priority.max,
        fullScreenIntent: true,
        category: AndroidNotificationCategory.alarm,
        visibility: NotificationVisibility.public,
        audioAttributesUsage: AudioAttributesUsage.alarm,
        playSound: true,
        enableVibration: true,
      );
      const NotificationDetails platformChannelSpecifics = NotificationDetails(
        android: androidPlatformChannelSpecifics,
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
          interruptionLevel: InterruptionLevel.timeSensitive,
        ),
      );

      await flutterLocalNotificationsPlugin.cancel(108);
      try {
        await flutterLocalNotificationsPlugin.zonedSchedule(
          108,
          '12:00 PM Daily Meditation 🙏',
          'Today\'s 6-minute divine meditation is starting now.',
          scheduledDate,
          platformChannelSpecifics,
          androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
          uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
          payload: 'daily_meditation',
        );
      } catch (_) {
        // Fallback to inexactAllowWhileIdle if exact alarm permission was not granted by OS
        await flutterLocalNotificationsPlugin.zonedSchedule(
          108,
          '12:00 PM Daily Meditation 🙏',
          'Today\'s 6-minute divine meditation is starting now.',
          scheduledDate,
          platformChannelSpecifics,
          androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
          uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
          payload: 'daily_meditation',
        );
      }
    } catch (e) {
      debugPrint('Schedule noon alarm notice: $e');
    }
  }

  /// Syncs the native Android AlarmManager + Foreground MediaPlayer Service so
  /// 12:00 PM meditation audio starts playing automatically in the background
  /// even when the app is minimized, swiped away, or the screen is locked.
  Future<void> _syncBackgroundKeepAlive({bool requestPermission = false}) async {
    if (kIsWeb || !Platform.isAndroid) return;
    try {
      await _noonAndroidChannel.invokeMethod('syncSchedule', {
        'enabled': isDailyMeditationScheduled,
        'requestPermission': requestPermission,
      });
    } catch (e) {
      debugPrint('Native noon schedule sync notice: $e');
    }
  }

  Future<void> _syncFromNativeAndroidStatus() async {
    if (kIsWeb || !Platform.isAndroid) return;
    try {
      final raw = await _noonAndroidChannel.invokeMethod('getStatus');
      if (raw is Map) {
        final sessionActive = raw['isSessionActive'] == true;
        if (sessionActive) {
          final dayIdx = (raw['dayIndex'] as int?) ?? DateTime.now().weekday;
          final remSec = (raw['remainingSec'] as int?) ?? 360;
          final nativePlaying = raw['isPlaying'] == true;
          final simulated = raw['isSimulated'] == true;
          final track = meditationSchedule.firstWhere(
            (m) => m.dayIndex == dayIdx,
            orElse: () => meditationSchedule.first,
          );

          // Pause Dart audioPlayer if it was playing another song so there's no overlap
          if (_audioPlayer.state == PlayerState.playing) {
            await _audioPlayer.pause();
          }

          activeMeditationTrack = track;
          isMeditationActive = true;
          isMeditationSimulated = simulated;
          _usingNativeAndroidPlayer = true;
          meditationTimeRemaining = remSec > 0 ? remSec : 1;
          isPlaying = nativePlaying;
          currentTrack = Song(
            id: '${simulated ? "meditation-sim" : "meditation-noon"}-${track.dayIndex}',
            title: track.title,
            artist: '${track.dayName} 12:00 PM Session',
            album: 'Daily Noon Meditation',
            category: 'Meditation',
            duration: '06:00',
            durationSec: 360,
            coverUrl: track.coverUrl,
            audioUrl: track.audioUrl,
            lyrics: track.mantra,
            plays: '108',
          );
          _startMeditationCountdown();
          notifyListeners();
        } else if (_usingNativeAndroidPlayer && isMeditationActive) {
          // Native session ended or was stopped via notification Stop button
          _usingNativeAndroidPlayer = false;
          isMeditationActive = false;
          isMeditationSimulated = false;
          isPlaying = false;
          _meditationCountdownTimer?.cancel();
          if (songs.isNotEmpty) {
            currentTrack = songs.first;
          }
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Native noon status check notice: $e');
    }
  }

  void toggleDailyMeditationSchedule() async {
    isDailyMeditationScheduled = !isDailyMeditationScheduled;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_daily_meditation_scheduled', isDailyMeditationScheduled);
    await _syncBackgroundKeepAlive(requestPermission: isDailyMeditationScheduled);
    
    if (isDailyMeditationScheduled) {
      _dismissedNoonDate = null;
      if (!kIsWeb && !Platform.isAndroid) await _scheduleDailyNoonNotification();
      await _syncFromNativeAndroidStatus();
      _checkNoonWindow();
    } else {
      if (!kIsWeb && !Platform.isAndroid) await flutterLocalNotificationsPlugin.cancel(108);
      if (isMeditationActive && !isMeditationSimulated) {
        stopMeditation();
      }
    }
    notifyListeners();
  }

  void _initAudioListeners() {
    if (!kIsWeb) {
      AudioPlayer.global.setAudioContext(
        AudioContext(
          android: const AudioContextAndroid(
            stayAwake: true,
            contentType: AndroidContentType.music,
            usageType: AndroidUsageType.media,
            audioFocus: AndroidAudioFocus.gain,
          ),
          iOS: AudioContextIOS(
            category: AVAudioSessionCategory.playback,
            options: const {
              AVAudioSessionOptions.mixWithOthers,
            },
          ),
        ),
      );
    }

    _audioPlayer.onPositionChanged.listen((p) {
      position = p;
      notifyListeners();
    });

    _audioPlayer.onDurationChanged.listen((d) {
      duration = d;
      notifyListeners();
    });

    _audioPlayer.onPlayerStateChanged.listen((state) {
      isPlaying = (state == PlayerState.playing);
      notifyListeners();
    });

    _audioPlayer.onPlayerComplete.listen((_) {
      if (isMeditationActive) {
        // Continuous loop during meditation session
        _audioPlayer.seek(Duration.zero);
        _audioPlayer.resume();
      } else if (repeatMode == 'track') {
        _audioPlayer.seek(Duration.zero);
        _audioPlayer.resume();
      } else {
        handleNextTrack();
      }
    });
  }

  // Init local disk offline tracks
  Future<void> _initOfflineCache() async {
    if (kIsWeb) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final downloadedIds = prefs.getStringList('downloaded_song_ids') ?? [];

      for (var song in songs) {
        if (downloadedIds.contains(song.id)) {
          song.isDownloaded = true;
        }
      }
      offlineSongs = songs.where((s) => s.isDownloaded).toList();
      notifyListeners();
    } catch (e) {
      debugPrint('Offline cache init error: $e');
    }
  }

  // Sharp 12:00 PM - 12:06 PM Meditation Engine
  void _checkNoonWindow() {
    final now = DateTime.now();
    final todayKey = '${now.year}-${now.month}-${now.day}';
    final isNoonWindow = (now.hour == 12 && now.minute >= 0 && now.minute < 6);

    if (isDailyMeditationScheduled &&
        isNoonWindow &&
        !isMeditationActive &&
        !isMeditationSimulated &&
        _dismissedNoonDate != todayKey) {
      final dayIdx = now.weekday; // 1 = Monday ... 7 = Sunday
      final track = meditationSchedule.firstWhere(
        (m) => m.dayIndex == dayIdx,
        orElse: () => meditationSchedule.first,
      );

      activeMeditationTrack = track;
      isMeditationActive = true;
      isMeditationSimulated = false;
      meditationTimeRemaining = (6 * 60) - (now.minute * 60 + now.second);

      // Force-play day's meditation audio automatically without toggle interception
      _playMeditationTrackAudio(track, isSimulated: false);

      _startMeditationCountdown();
      if (!kIsWeb) {
        // Schedule tomorrow's 12:00 PM alarm as well
        Future.delayed(const Duration(seconds: 2), _scheduleDailyNoonNotification);
      }
      notifyListeners();
    } else if (!isNoonWindow && isMeditationActive && !isMeditationSimulated) {
      stopMeditation();
    }
  }

  void _startNoonTimer() {
    _noonTimer?.cancel();
    _noonTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!kIsWeb && Platform.isAndroid && _usingNativeAndroidPlayer) {
        _syncFromNativeAndroidStatus();
      }
      _checkNoonWindow();
    });
  }

  void _startMeditationCountdown() {
    _meditationCountdownTimer?.cancel();
    _meditationCountdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (meditationTimeRemaining <= 1) {
        stopMeditation();
      } else {
        if (isPlaying) {
          meditationTimeRemaining--;
          notifyListeners();
        }
      }
    });
  }

  Future<void> _playMeditationTrackAudio(MeditationTrack track, {required bool isSimulated}) async {
    final medSong = Song(
      id: '${isSimulated ? "meditation-sim" : "meditation-noon"}-${track.dayIndex}',
      title: track.title,
      artist: '${track.dayName} 12:00 PM Session',
      album: 'Daily Noon Meditation',
      category: 'Meditation',
      duration: '06:00',
      durationSec: 360,
      coverUrl: track.coverUrl,
      audioUrl: track.audioUrl,
      lyrics: track.mantra,
      plays: '108',
    );
    currentTrack = medSong;
    isPlaying = true;
    notifyListeners();

    if (!kIsWeb && Platform.isAndroid) {
      try {
        await _audioPlayer.stop();
        _usingNativeAndroidPlayer = true;
        await _noonAndroidChannel.invokeMethod('startPlayback', {
          'dayIndex': track.dayIndex,
          'durationSec': meditationTimeRemaining > 0 ? meditationTimeRemaining : 360,
          'isSimulated': isSimulated,
          'volume': isMuted ? 0.0 : volume,
        });
        isPlaying = true;
        notifyListeners();
        return;
      } catch (e) {
        _usingNativeAndroidPlayer = false;
        debugPrint('Native meditation playback fallback notice: $e');
      }
    }

    Future<void> attemptStart() async {
      if (!isMeditationActive) return;
      try {
        await _audioPlayer.stop();
        await _audioPlayer.setReleaseMode(ReleaseMode.loop);
        await _audioPlayer.setVolume(isMuted ? 0 : volume);
        if (medSong.audioUrl.startsWith('assets/')) {
          final assetPath = medSong.audioUrl.replaceFirst('assets/', '');
          await _audioPlayer.play(AssetSource(assetPath));
        } else {
          await _audioPlayer.play(UrlSource(medSong.audioUrl));
        }
        isPlaying = true;
        notifyListeners();
      } catch (e) {
        debugPrint('Meditation audio start notice: $e');
      }
    }

    await attemptStart();

    // Verify & retry after 600ms and 1600ms in case the Activity was waking from background
    for (final delayMs in [600, 1600]) {
      Future.delayed(Duration(milliseconds: delayMs), () async {
        if (isMeditationActive && !_usingNativeAndroidPlayer && _audioPlayer.state != PlayerState.playing) {
          await attemptStart();
        }
      });
    }
  }

  Future<void> ensureMeditationAudioPlaying() async {
    if (!isMeditationActive || activeMeditationTrack == null) return;
    if (!kIsWeb && Platform.isAndroid && _usingNativeAndroidPlayer) {
      await _syncFromNativeAndroidStatus();
      return;
    }
    if (_audioPlayer.state != PlayerState.playing) {
      await _playMeditationTrackAudio(activeMeditationTrack!, isSimulated: isMeditationSimulated);
    }
  }

  void triggerMeditationSimulation(int dayIdx) {
    final track = meditationSchedule.firstWhere(
      (m) => m.dayIndex == dayIdx,
      orElse: () => meditationSchedule.first,
    );
    activeMeditationTrack = track;
    isMeditationActive = true;
    isMeditationSimulated = true;
    meditationTimeRemaining = 360;

    // Force-play simulated meditation audio without toggle interception!
    _playMeditationTrackAudio(track, isSimulated: true);

    _startMeditationCountdown();
    notifyListeners();
  }

  void stopMeditation() {
    final now = DateTime.now();
    final inNoonWindow = now.hour == 12 && now.minute >= 0 && now.minute < 6;
    if (inNoonWindow) {
      _dismissedNoonDate = '${now.year}-${now.month}-${now.day}';
    }
    isMeditationActive = false;
    isMeditationSimulated = false;
    _meditationCountdownTimer?.cancel();
    if (!kIsWeb && Platform.isAndroid && _usingNativeAndroidPlayer) {
      _usingNativeAndroidPlayer = false;
      isPlaying = false;
      _noonAndroidChannel.invokeMethod('stopPlayback', {
        'markDismissed': inNoonWindow,
      });
      if (songs.isNotEmpty) {
        currentTrack = songs.first;
      }
      notifyListeners();
      return;
    }
    if (currentTrack?.id.startsWith('meditation-') ?? false) {
      isPlaying = false;
      _audioPlayer.setReleaseMode(ReleaseMode.release);
      _audioPlayer.stop();
      if (songs.isNotEmpty) {
        currentTrack = songs.first;
      }
    }
    notifyListeners();
  }

  // Guest Play Counter
  int guestPlayCount = 0;
  bool guestLimitReached = false;

  void incrementGuestPlayCount() {
    guestPlayCount++;
    if (guestPlayCount >= 3) {
      guestLimitReached = true;
    }
    notifyListeners();
  }

  void resetGuestPlayCount() {
    guestPlayCount = 0;
    guestLimitReached = false;
    notifyListeners();
  }

  // In-App DRM Encryption Key ("SHAMBALA")
  static final List<int> _drmKey = [0x53, 0x48, 0x41, 0x4D, 0x42, 0x41, 0x4C, 0x41];

  static Uint8List _cipherDrmBytes(Uint8List bytes) {
    final result = Uint8List(bytes.length);
    for (int i = 0; i < bytes.length; i++) {
      result[i] = bytes[i] ^ _drmKey[i % _drmKey.length];
    }
    return result;
  }

  // Audio Playback Controls
  Future<void> playTrack(Song song, [List<Song>? newQueue]) async {
    // If tapping the currently selected track, toggle Play/Pause instead of restarting
    if (currentTrack != null && currentTrack!.id == song.id) {
      if (newQueue != null) {
        queue = List.from(newQueue);
        queueIndex = queue.indexWhere((s) => s.id == song.id);
        if (queueIndex < 0) queueIndex = 0;
      }
      if (isPlaying || _audioPlayer.state == PlayerState.playing || _audioPlayer.state == PlayerState.paused) {
        await togglePlay();
        return;
      }
    }

    if (newQueue != null) {
      queue = List.from(newQueue);
      queueIndex = queue.indexWhere((s) => s.id == song.id);
      if (queueIndex < 0) queueIndex = 0;
    }

    currentTrack = song;
    isPlaying = true;
    notifyListeners();

    try {
      await _audioPlayer.stop();
      if (!kIsWeb && song.isDownloaded && song.localAudioPath != null && File(song.localAudioPath!).existsSync()) {
        final encryptedFile = File(song.localAudioPath!);
        final encryptedBytes = await encryptedFile.readAsBytes();
        final decryptedBytes = _cipherDrmBytes(encryptedBytes);

        // Save temporary decrypted stream for internal player execution
        final tempDir = await getTemporaryDirectory();
        final tempFile = File('${tempDir.path}/temp_stream_${song.id}.mp3');
        await tempFile.writeAsBytes(decryptedBytes);

        await _audioPlayer.play(DeviceFileSource(tempFile.path));
      } else if (song.audioUrl.startsWith('assets/')) {
        // Play local bundled asset file
        final assetPath = song.audioUrl.replaceFirst('assets/', '');
        await _audioPlayer.play(AssetSource(assetPath));
      } else {
        // Play remote stream audio
        await _audioPlayer.play(UrlSource(song.audioUrl));
      }
      await _audioPlayer.setVolume(isMuted ? 0 : volume);
    } catch (e) {
      debugPrint('Error playing audio: $e');
    }
  }

  Future<void> togglePlay() async {
    if (!kIsWeb && Platform.isAndroid && _usingNativeAndroidPlayer && isMeditationActive) {
      if (isPlaying) {
        isPlaying = false;
        notifyListeners();
        try {
          await _noonAndroidChannel.invokeMethod('pausePlayback');
        } catch (_) {}
      } else {
        isPlaying = true;
        notifyListeners();
        try {
          await _noonAndroidChannel.invokeMethod('resumePlayback');
        } catch (_) {}
      }
      return;
    }

    if (isPlaying) {
      isPlaying = false;
      notifyListeners();
      try {
        await _audioPlayer.pause();
      } catch (e) {
        debugPrint('Error pausing audio: $e');
      }
    } else {
      if (currentTrack != null) {
        isPlaying = true;
        notifyListeners();
        try {
          if (_audioPlayer.state == PlayerState.paused) {
            await _audioPlayer.resume();
          } else {
            // Source was not loaded yet (e.g. cold app start) or player completed/stopped
            final song = currentTrack!;
            if (!kIsWeb && song.isDownloaded && song.localAudioPath != null && File(song.localAudioPath!).existsSync()) {
              final encryptedFile = File(song.localAudioPath!);
              final encryptedBytes = await encryptedFile.readAsBytes();
              final decryptedBytes = _cipherDrmBytes(encryptedBytes);
              final tempDir = await getTemporaryDirectory();
              final tempFile = File('${tempDir.path}/temp_stream_${song.id}.mp3');
              await tempFile.writeAsBytes(decryptedBytes);
              await _audioPlayer.play(DeviceFileSource(tempFile.path));
            } else if (song.audioUrl.startsWith('assets/')) {
              final assetPath = song.audioUrl.replaceFirst('assets/', '');
              await _audioPlayer.play(AssetSource(assetPath));
            } else {
              await _audioPlayer.play(UrlSource(song.audioUrl));
            }
            await _audioPlayer.setVolume(isMuted ? 0 : volume);
          }
        } catch (e) {
          debugPrint('Error resuming audio: $e');
        }
      }
    }
  }

  Future<void> handleNextTrack() async {
    if (queue.isEmpty) return;
    if (isShuffle) {
      queueIndex = (queueIndex + 1 + (queue.length ~/ 2)) % queue.length;
    } else {
      queueIndex = (queueIndex + 1) % queue.length;
    }
    await playTrack(queue[queueIndex]);
  }

  Future<void> handlePrevTrack() async {
    if (queue.isEmpty) return;
    queueIndex = (queueIndex - 1 + queue.length) % queue.length;
    await playTrack(queue[queueIndex]);
  }

  Future<void> seek(Duration pos) async {
    await _audioPlayer.seek(pos);
  }

  Future<void> setAppVolume(double val) async {
    volume = val;
    await _audioPlayer.setVolume(isMuted ? 0 : volume);
    notifyListeners();
  }

  void toggleMute() {
    isMuted = !isMuted;
    _audioPlayer.setVolume(isMuted ? 0 : volume);
    notifyListeners();
  }

  void toggleShuffle() {
    isShuffle = !isShuffle;
    notifyListeners();
  }

  void toggleRepeatMode() {
    if (repeatMode == 'off') {
      repeatMode = 'track';
    } else if (repeatMode == 'track') {
      repeatMode = 'all';
    } else {
      repeatMode = 'off';
    }
    notifyListeners();
  }

  // Encrypted In-App DRM Offline Download Manager
  Future<void> downloadSong(Song song) async {
    try {
      if (kIsWeb) {
        song.isDownloaded = true;
        if (!offlineSongs.any((s) => s.id == song.id)) {
          offlineSongs.add(song);
        }
        final prefs = await SharedPreferences.getInstance();
        final downloadedIds = offlineSongs.map((s) => s.id).toList();
        await prefs.setStringList('downloaded_song_ids', downloadedIds);
        notifyListeners();
        return;
      }

      // Internal sandbox support directory (hidden from public gallery & media scanners)
      final dir = await getApplicationSupportDirectory();
      final filePath = '${dir.path}/${song.id}.shambala';

      final dio = Dio();
      final response = await dio.get<List<int>>(
        song.audioUrl,
        options: Options(responseType: ResponseType.bytes),
      );

      if (response.data != null) {
        final Uint8List rawBytes = Uint8List.fromList(response.data!);
        final Uint8List encryptedBytes = _cipherDrmBytes(rawBytes);

        final file = File(filePath);
        await file.writeAsBytes(encryptedBytes);

        song.isDownloaded = true;
        song.localAudioPath = filePath;

        if (!offlineSongs.any((s) => s.id == song.id)) {
          offlineSongs.add(song);
        }

        final prefs = await SharedPreferences.getInstance();
        final downloadedIds = offlineSongs.map((s) => s.id).toList();
        await prefs.setStringList('downloaded_song_ids', downloadedIds);

        notifyListeners();
      }
    } catch (e) {
      debugPrint('Encrypted download error: $e');
    }
  }

  Future<void> removeDownloadedSong(Song song) async {
    try {
      if (!kIsWeb && song.localAudioPath != null) {
        final file = File(song.localAudioPath!);
        if (file.existsSync()) {
          file.deleteSync();
        }
      }
      song.isDownloaded = false;
      song.localAudioPath = null;
      offlineSongs.removeWhere((s) => s.id == song.id);

      final prefs = await SharedPreferences.getInstance();
      final downloadedIds = offlineSongs.map((s) => s.id).toList();
      await prefs.setStringList('downloaded_song_ids', downloadedIds);

      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting download: $e');
    }
  }

  void toggleOfflineMode() {
    isOfflineMode = !isOfflineMode;
    notifyListeners();
  }

  void toggleLikedSong(Song song) {
    song.isLiked = !song.isLiked;
    notifyListeners();
  }

  // Admin Publishing Actions
  void addNewSong(Song song) {
    songs.insert(0, song);
    queue.insert(0, song);
    notifyListeners();
  }

  void addNewPodcastEpisode(String podcastId, PodcastEpisode ep) {
    final idx = podcasts.indexWhere((p) => p.id == podcastId);
    if (idx >= 0) {
      podcasts[idx].episodes.insert(0, ep);
      notifyListeners();
    }
  }

  void toggleLiveStatus() {
    liveFeed.isLive = !liveFeed.isLive;
    notifyListeners();
  }

  void addChatMessage(String text) {
    liveFeed.chatMessages.add(
      ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        user: 'You (Divine Seeker)',
        text: text,
        time: 'Just now',
      ),
    );
    notifyListeners();
  }

  void setSearch(String query) {
    searchQuery = query;
    notifyListeners();
  }

  void setCategory(String category) {
    selectedCategory = category;
    notifyListeners();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _audioPlayer.dispose();
    _noonTimer?.cancel();
    _meditationCountdownTimer?.cancel();
    super.dispose();
  }
}
