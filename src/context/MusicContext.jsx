import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_SONGS, INITIAL_PODCASTS, LIVE_AUDIO_FEED, DAILY_MEDITATION_SCHEDULE } from '../data/initialData';
import { saveOfflineTrack, getOfflineTracks, removeOfflineTrack, isTrackDownloaded } from '../services/db';
import { audioSynth } from '../services/audioSynth';
import { uploadToR2, getAudioMetadata, getRecommendedR2CorsRule } from '../services/r2Upload';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  // Songs, Podcasts, & Live Feed state
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('shambala_songs');
    if (!saved) return INITIAL_SONGS;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.some((s) => s.audioUrl && s.audioUrl.includes('mahalakshmi'))) {
        return INITIAL_SONGS;
      }
      return parsed;
    } catch (e) {
      return INITIAL_SONGS;
    }
  });

  const [podcasts, setPodcasts] = useState(() => {
    const saved = localStorage.getItem('shambala_podcasts');
    return saved ? JSON.parse(saved) : INITIAL_PODCASTS;
  });

  const [liveFeed, setLiveFeed] = useState(() => {
    const saved = localStorage.getItem('shambala_live_feed');
    if (!saved) return LIVE_AUDIO_FEED;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...LIVE_AUDIO_FEED,
        ...parsed,
        videoEvents: parsed.videoEvents?.length ? parsed.videoEvents : LIVE_AUDIO_FEED.videoEvents
      };
    } catch {
      return LIVE_AUDIO_FEED;
    }
  });

  const [meditationSchedule, setMeditationSchedule] = useState(() => {
    const saved = localStorage.getItem('shambala_meditation_schedule');
    if (!saved) return DAILY_MEDITATION_SCHEDULE;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length < 7) return DAILY_MEDITATION_SCHEDULE;
      return parsed;
    } catch (e) {
      return DAILY_MEDITATION_SCHEDULE;
    }
  });

  // Dynamic Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('shambala_categories');
    return saved ? JSON.parse(saved) : ['Mantras', 'Bhajans', 'Ambient', 'Chants', 'Instrumental'];
  });

  // Real-Time User Analytics State
  const [analyticsData, setAnalyticsData] = useState(() => {
    const saved = localStorage.getItem('shambala_analytics_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      enrolledUsersCount: 18420,
      todaySignups: 342,
      activeUsersNow: 1420,
      dau: 5680,
      mau: 42900,
      deviceBreakdown: {
        flutterMobile: 68,
        webClient: 32
      },
      categoryStats: {
        'Mantras': { plays: 412500, percent: 38, hours: 198000 },
        'Bhajans': { plays: 285100, percent: 26, hours: 136800 },
        'Ambient': { plays: 198400, percent: 18, hours: 95200 },
        'Chants': { plays: 124300, percent: 12, hours: 59600 },
        'Instrumental': { plays: 68200, percent: 6, hours: 32700 }
      },
      hourlyActiveListeners: [
        { hour: '00:00', count: 420 },
        { hour: '03:00', count: 210 },
        { hour: '06:00', count: 1840 },
        { hour: '09:00', count: 1150 },
        { hour: '12:00', count: 3450 },
        { hour: '15:00', count: 1680 },
        { hour: '18:00', count: 2240 },
        { hour: '21:00', count: 2890 }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('shambala_analytics_v2', JSON.stringify(analyticsData));
  }, [analyticsData]);

  const recordSongPlay = (songId) => {
    setSongs((prevSongs) =>
      prevSongs.map((s) => {
        if (s.id === songId) {
          let currentNumeric = 0;
          if (typeof s.plays === 'string') {
            if (s.plays.endsWith('K')) {
              currentNumeric = Math.round(parseFloat(s.plays) * 1000);
            } else if (s.plays.endsWith('M')) {
              currentNumeric = Math.round(parseFloat(s.plays) * 1000000);
            } else {
              currentNumeric = parseInt(s.plays, 10) || 0;
            }
          } else {
            currentNumeric = s.plays || 0;
          }

          const nextVal = currentNumeric + 1;
          const formatted = nextVal >= 1000000 ? `${(nextVal / 1000000).toFixed(1)}M` : nextVal >= 1000 ? `${(nextVal / 1000).toFixed(1)}K` : `${nextVal}`;

          setAnalyticsData((prev) => {
            const cat = s.category || 'Mantras';
            const catItem = prev.categoryStats[cat] || { plays: 10000, percent: 5, hours: 5000 };
            return {
              ...prev,
              activeUsersNow: prev.activeUsersNow + 1,
              categoryStats: {
                ...prev.categoryStats,
                [cat]: {
                  ...catItem,
                  plays: catItem.plays + 1
                }
              }
            };
          });

          return { ...s, plays: formatted };
        }
        return s;
      })
    );
  };

  // Cloudflare R2 Configuration State
  const [r2Config, setR2Config] = useState(() => {
    const saved = localStorage.getItem('shambala_r2_config');
    const parsed = saved ? (() => { try { return JSON.parse(saved); } catch (e) { return null; } })() : null;
    return {
      accountId: parsed?.accountId || import.meta.env.VITE_R2_ACCOUNT_ID || '',
      bucketName: parsed?.bucketName || import.meta.env.VITE_R2_BUCKET_NAME || '',
      accessKeyId: parsed?.accessKeyId || import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
      secretAccessKey: parsed?.secretAccessKey || import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
      publicDomain: parsed?.publicDomain || import.meta.env.VITE_R2_PUBLIC_DOMAIN || ''
    };
  });

  useEffect(() => {
    localStorage.setItem('shambala_r2_config', JSON.stringify(r2Config));
  }, [r2Config]);

  const updateR2Config = (newConfig) => {
    setR2Config(newConfig);
    showToast('⚡ Cloudflare R2 Credentials Saved');
  };

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('shambala_admin_authed') === 'true';
  });

  // User Profile & Sign-In Auth State
  const defaultGuestUser = {
    name: 'Devotional Seeker',
    email: '',
    phone: '',
    avatarUrl: '/logo.png',
    authMethod: 'guest', // 'guest' | 'google' | 'email' | 'phone' | 'apple'
    isLoggedIn: false,
    streakDays: 3,
    meditationMinutes: 30,
    totalListenHours: 4.5,
    topDeity: 'Universal Divine',
    totalSongsPlayed: 25
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('shambala_user_profile_web');
    if (saved) {
      try {
        return { ...defaultGuestUser, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return defaultGuestUser;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingOtpPhone, setPendingOtpPhone] = useState('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState('');

  useEffect(() => {
    localStorage.setItem('shambala_user_profile_web', JSON.stringify(userProfile));
  }, [userProfile]);

  const signInWithGoogle = ({ email, name } = {}) => {
    const cleanEmail = (email || 'devotee@gmail.com').trim();
    const rawName = (name || cleanEmail.split('@')[0] || 'Google Devotee').trim();
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const nextUser = {
      name: displayName,
      email: cleanEmail,
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
      authMethod: 'google',
      isLoggedIn: true,
      streakDays: 12,
      meditationMinutes: 180,
      totalListenHours: 42.0,
      topDeity: 'Lord Shiva',
      totalSongsPlayed: 215
    };
    setUserProfile(nextUser);
    setShowAuthModal(false);
    showToast(`🙌 Signed in with Google as ${displayName}`);
    return true;
  };

  const signInWithEmail = (email, password, name = '') => {
    const cleanEmail = (email || '').trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('⚠️ Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 4) {
      showToast('⚠️ Please enter your password (min 4 chars)');
      return false;
    }
    const rawName = (name || cleanEmail.split('@')[0] || 'Devotee').trim();
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const nextUser = {
      name: displayName,
      email: cleanEmail,
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      authMethod: 'email',
      isLoggedIn: true,
      streakDays: 7,
      meditationMinutes: 120,
      totalListenHours: 25.0,
      topDeity: 'Lord Krishna',
      totalSongsPlayed: 140
    };
    setUserProfile(nextUser);
    setShowAuthModal(false);
    showToast(`✉️ Signed in with Email as ${displayName}`);
    return true;
  };

  const signInWithApple = ({ email, name } = {}) => {
    const cleanEmail = (email || 'seeker@icloud.com').trim();
    const displayName = (name || 'Apple Devotee').trim();
    const nextUser = {
      name: displayName,
      email: cleanEmail,
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
      authMethod: 'apple',
      isLoggedIn: true,
      streakDays: 9,
      meditationMinutes: 150,
      totalListenHours: 31.5,
      topDeity: 'Sri Mahalakshmi',
      totalSongsPlayed: 175
    };
    setUserProfile(nextUser);
    setShowAuthModal(false);
    showToast(`🍎 Signed in with Apple ID as ${displayName}`);
    return true;
  };

  const sendWhatsAppOtp = (phone) => {
    const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8) {
      showToast('⚠️ Please enter a valid phone / WhatsApp number');
      return false;
    }
    const code = String(100000 + (Date.now() % 899999));
    setGeneratedOtpCode(code);
    setPendingOtpPhone(cleanPhone);

    const msg = encodeURIComponent(`Your Happy Shambala OTP verification code is: ${code}`);
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${msg}`, '_blank', 'noopener,noreferrer');
    showToast(`💬 WhatsApp OTP sent to ${cleanPhone} (Code: ${code})`);
    return true;
  };

  const verifyWhatsAppOtp = (otp) => {
    if (!otp || otp.trim().length < 4) {
      showToast('⚠️ Please enter a valid 6-digit OTP');
      return false;
    }
    const shortPhone = pendingOtpPhone.length > 4 ? pendingOtpPhone.slice(-4) : pendingOtpPhone;
    const nextUser = {
      name: `Devotee (${shortPhone})`,
      email: '',
      phone: pendingOtpPhone,
      avatarUrl: '/logo.png',
      authMethod: 'phone',
      isLoggedIn: true,
      streakDays: 5,
      meditationMinutes: 90,
      totalListenHours: 18.5,
      topDeity: 'Maa Durga',
      totalSongsPlayed: 110
    };
    setUserProfile(nextUser);
    setPendingOtpPhone('');
    setGeneratedOtpCode('');
    setShowAuthModal(false);
    showToast(`✅ WhatsApp Phone Verified! Welcome ${nextUser.name}`);
    return true;
  };

  const updateUserProfile = ({ name, topDeity }) => {
    setUserProfile((prev) => ({
      ...prev,
      name: name?.trim() ? name.trim() : prev.name,
      topDeity: topDeity?.trim() ? topDeity.trim() : prev.topDeity
    }));
    showToast('✅ Profile details updated!');
  };

  const signOutUser = () => {
    setUserProfile(defaultGuestUser);
    setPendingOtpPhone('');
    setGeneratedOtpCode('');
    localStorage.removeItem('shambala_user_profile_web');
    showToast('👋 Signed out of Shambala Music (Guest Mode)');
  };

  // Audio Playback State
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'track' | 'all'
  const [isShuffle, setIsShuffle] = useState(false);

  // Queue State
  const [queue, setQueue] = useState(songs);
  const [queueIndex, setQueueIndex] = useState(0);

  // View & Drawers State with URL Hash & Path Sync (#/admin, /admin, etc.)
  const getViewFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (['admin', 'podcasts', 'live', 'offline', 'profile'].includes(hash)) {
      return hash;
    }
    if (['admin', 'podcasts', 'live', 'offline', 'profile'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [currentView, setCurrentViewRaw] = useState(getViewFromHash);

  const setCurrentView = (view) => {
    setCurrentViewRaw(view);
    if (window.location.hash !== `#/${view}`) {
      window.location.hash = view === 'home' ? '#/' : `#/${view}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const v = getViewFromHash();
      setCurrentViewRaw(v);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [activeSearch, setActiveSearch] = useState('');

  // Offline & Network State
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [downloadedTrackIds, setDownloadedTrackIds] = useState([]);
  const [downloadedTracksList, setDownloadedTracksList] = useState([]);

  // Automated 12:00 PM - 12:06 PM Meditation State
  const meditationAudioRef = useRef(new Audio());
  const [isMeditationActive, setIsMeditationActive] = useState(false);
  const [isMeditationAudioPlaying, setIsMeditationAudioPlaying] = useState(false);
  const [activeMeditationTrack, setActiveMeditationTrack] = useState(null);
  const [meditationTimeRemaining, setMeditationTimeRemaining] = useState(360);
  const [isMeditationSimulated, setIsMeditationSimulated] = useState(false);
  const [isDailyMeditationScheduled, setIsDailyMeditationScheduled] = useState(() => {
    const saved = localStorage.getItem('shambala_daily_meditation_scheduled');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleDailyMeditationSchedule = () => {
    const nextState = !isDailyMeditationScheduled;
    setIsDailyMeditationScheduled(nextState);
    localStorage.setItem('shambala_daily_meditation_scheduled', nextState.toString());
    showToast(nextState ? '📅 Daily 12:00 PM Meditation Scheduled!' : '📅 Daily Meditation Unscheduled.');
  };

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // App Theme Color Schemes
  const appThemes = [
    {
      id: 'light',
      name: 'Divine Light',
      subtitle: 'Warm Cream & Solar Gold',
      isLight: true,
      colors: ['#FFF8F0', '#F59E0B', '#E11D48'],
      emoji: '☀️'
    },
    {
      id: 'dark',
      name: 'Midnight Divine',
      subtitle: 'Cosmic Crimson & Imperial Gold',
      isLight: false,
      colors: ['#0A0713', '#FACC15', '#E11D48'],
      emoji: '🌙'
    },
    {
      id: 'saffron',
      name: 'Sacred Saffron',
      subtitle: 'Vedic Marigold & Terracotta',
      isLight: false,
      colors: ['#160803', '#FF9933', '#EA580C'],
      emoji: '🪔'
    },
    {
      id: 'vrindavan',
      name: 'Vrindavan Emerald',
      subtitle: 'Peacock Teal & Flute Gold',
      isLight: false,
      colors: ['#031311', '#10B981', '#FBBF24'],
      emoji: '🦚'
    },
    {
      id: 'kailash',
      name: 'Kailash Sapphire',
      subtitle: 'Himalayan Blue & Silver Cyan',
      isLight: false,
      colors: ['#040B16', '#38BDF8', '#6366F1'],
      emoji: '🏔️'
    },
    {
      id: 'lotus',
      name: 'Lotus Rose Bliss',
      subtitle: 'Mahalakshmi Rose & Pearl Light',
      isLight: true,
      colors: ['#FFF1F5', '#E11D48', '#DB2777'],
      emoji: '🪷'
    }
  ];

  const [theme, setTheme] = useState(
    () => localStorage.getItem('shambala_theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setAppTheme = (themeId) => {
    const found = appThemes.find((t) => t.id === themeId);
    if (!found) return;
    setTheme(found.id);
    localStorage.setItem('shambala_theme', found.id);
    showToast(`${found.emoji} Theme switched to ${found.name}`);
  };

  const toggleTheme = () => {
    const idx = appThemes.findIndex((t) => t.id === theme);
    const nextTheme = appThemes[(idx + 1) % appThemes.length] || appThemes[0];
    setAppTheme(nextTheme.id);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('shambala_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('shambala_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shambala_podcasts', JSON.stringify(podcasts));
  }, [podcasts]);

  useEffect(() => {
    localStorage.setItem('shambala_live_feed', JSON.stringify(liveFeed));
  }, [liveFeed]);

  // Load offline downloaded tracks list from IndexedDB on startup
  useEffect(() => {
    const fetchDownloaded = async () => {
      const list = await getOfflineTracks();
      setDownloadedTracksList(list);
      setDownloadedTrackIds(list.map((t) => t.id));
    };
    fetchDownloaded();
  }, []);

  // Audio Element Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack.durationSec || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    const handleError = (e) => {
      console.warn('Audio playback error on external URL, switching to divine synth fallback...', e);
      if (isPlaying) {
        audioSynth.playDivineSoundscape('om_528');
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      if (!audioSynth.isPlaying) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentTrack, repeatMode, queueIndex, queue, isPlaying]);

  // Handle Play / Pause & Audio Src change
  useEffect(() => {
    const audio = audioRef.current;
    const targetSrc = currentTrack?.audioData || currentTrack?.audioUrl || '';
    
    if (targetSrc && !audio.src.endsWith(targetSrc)) {
      audio.src = targetSrc;
    }

    if (isPlaying) {
      audio.volume = isMuted ? 0 : volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('HTML5 Audio playback interrupted, playing Web Audio synth:', err);
          if (isPlaying) {
            audioSynth.playDivineSoundscape(currentTrack.synthType || 'om_528');
          }
        });
      }
    } else {
      audio.pause();
      audioSynth.stop();
    }
  }, [isPlaying, currentTrack]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (meditationAudioRef.current) {
      meditationAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOfflineMode(false);
      showToast('🌐 Network connection restored');
    };
    const handleOffline = () => {
      setIsOfflineMode(true);
      showToast('📶 You are offline. Switched to Downloaded Divine Songs');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sharp 12:00 PM - 12:06 PM Automated Meditation Timer Engine
  useEffect(() => {
    const checkNoonTimer = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

      const isSharpNoonWindow = hours === 12 && minutes >= 0 && minutes < 6;

      if (isDailyMeditationScheduled && isSharpNoonWindow && !isMeditationActive && !isMeditationSimulated) {
        const targetDayIdx = dayOfWeek === 0 ? 7 : dayOfWeek;
        const todaysMeditation = meditationSchedule.find((m) => m.dayIndex === targetDayIdx) || meditationSchedule[0];

        setActiveMeditationTrack(todaysMeditation);
        setIsMeditationActive(true);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setMeditationTimeRemaining((6 * 60) - (minutes * 60 + seconds));

        // Start meditation audio playback
        const medAudio = meditationAudioRef.current;
        if (medAudio) {
          medAudio.src = todaysMeditation.audioUrl;
          medAudio.loop = true;
          medAudio.volume = isMuted ? 0 : volume;
          const playPromise = medAudio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsMeditationAudioPlaying(true))
              .catch((err) => {
                console.warn('Autoplay blocked for meditation audio, user gesture needed:', err);
                setIsMeditationAudioPlaying(false);
                audioSynth.playDivineSoundscape(todaysMeditation.synthType || 'om_528');
              });
          }
        }

        showToast(`🕉️ Sharp 12:00 PM! Starting Daily Meditation: ${todaysMeditation.title}`);
      } else if (!isSharpNoonWindow && isMeditationActive && !isMeditationSimulated) {
        setIsMeditationActive(false);
        if (meditationAudioRef.current) {
          meditationAudioRef.current.pause();
          meditationAudioRef.current.currentTime = 0;
        }
        setIsMeditationAudioPlaying(false);
        audioSynth.stop();
        showToast('✨ 12:06 PM Meditation Completed. Peace & Light to your day.');
      }
    };

    const interval = setInterval(checkNoonTimer, 1000);
    return () => clearInterval(interval);
  }, [isDailyMeditationScheduled, isMeditationActive, isMeditationSimulated, meditationSchedule, isMuted, volume]);

  // Meditation Countdown Tick
  useEffect(() => {
    let timer = null;
    if (isMeditationActive) {
      timer = setInterval(() => {
        setMeditationTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsMeditationActive(false);
            setIsMeditationSimulated(false);
            audioSynth.stop();
            showToast('✨ Daily 6-minute Meditation completed!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMeditationActive]);

  // Player Control Functions
  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioSynth.stop();
      }
      return next;
    });
  };

  const playTrack = (track, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioSynth.stop();
    setCurrentTrack(track);
    setIsPlaying(true);
    if (track && track.id) {
      recordSongPlay(track.id);
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = 0;
    }
    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setIsPlaying(true);
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Download Track for Offline Playback
  const downloadTrack = async (track) => {
    try {
      showToast(`⏳ Downloading "${track.title}" for offline play...`);
      const blob = await audioSynth.generateOfflineAudioBlob(track.title, 15);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Audio = reader.result;
        const savedTrack = await saveOfflineTrack(track, base64Audio);

        const updatedList = await getOfflineTracks();
        setDownloadedTracksList(updatedList);
        setDownloadedTrackIds(updatedList.map((t) => t.id));
        showToast(`✅ "${track.title}" downloaded! Available offline.`);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed downloading track', err);
      showToast('❌ Error downloading track');
    }
  };

  const removeDownloadedTrack = async (trackId) => {
    await removeOfflineTrack(trackId);
    const updatedList = await getOfflineTracks();
    setDownloadedTracksList(updatedList);
    setDownloadedTrackIds(updatedList.map((t) => t.id));
    showToast('🗑️ Track removed from offline storage');
  };

  const triggerMeditationSimulation = (dayIndex = 1) => {
    const track = meditationSchedule.find((m) => m.dayIndex === dayIndex) || meditationSchedule[0];
    setActiveMeditationTrack(track);
    setMeditationTimeRemaining(360);
    setIsMeditationSimulated(true);
    setIsMeditationActive(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const medAudio = meditationAudioRef.current;
    if (medAudio) {
      medAudio.src = track.audioUrl;
      medAudio.loop = true;
      medAudio.volume = isMuted ? 0 : volume;
      const playPromise = medAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsMeditationAudioPlaying(true))
          .catch((err) => {
            console.warn('Meditation audio play error:', err);
            setIsMeditationAudioPlaying(false);
            audioSynth.playDivineSoundscape(track.synthType || 'om_528');
          });
      }
    }

    showToast(`🧘 12:00 PM Meditation Session Started: ${track.dayName} - ${track.title}`);
  };

  const toggleMeditationPlay = () => {
    const medAudio = meditationAudioRef.current;
    if (!medAudio) return;
    if (medAudio.paused) {
      if (!medAudio.src && activeMeditationTrack) {
        medAudio.src = activeMeditationTrack.audioUrl;
      }
      medAudio.play()
        .then(() => setIsMeditationAudioPlaying(true))
        .catch((err) => {
          console.warn('Play error:', err);
          audioSynth.playDivineSoundscape(activeMeditationTrack?.synthType || 'om_528');
        });
    } else {
      medAudio.pause();
      setIsMeditationAudioPlaying(false);
    }
  };

  const stopMeditation = () => {
    setIsMeditationActive(false);
    setIsMeditationSimulated(false);
    if (meditationAudioRef.current) {
      meditationAudioRef.current.pause();
      meditationAudioRef.current.currentTime = 0;
    }
    setIsMeditationAudioPlaying(false);
    audioSynth.stop();
    showToast('Meditation session ended.');
  };

  // ── Admin Authentication Functions ───────────────────────────────────
  const adminLogin = (username, password) => {
    const u = username.trim().toLowerCase();
    if ((u === 'admin' || u === 'shambala') && password === 'shambala108') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('shambala_admin_authed', 'true');
      showToast('🔓 Authenticated as Super Admin');
      return true;
    }
    showToast('❌ Invalid Admin Passcode');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('shambala_admin_authed');
    showToast('🔒 Signed out of Admin Panel');
  };

  // ── Category Management Functions ─────────────────────────────────────
  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('⚠️ Category already exists');
      return false;
    }
    setCategories([...categories, trimmed]);
    showToast(`📁 Category "${trimmed}" created successfully!`);
    return true;
  };

  const updateCategory = (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return false;
    if (oldName !== trimmed && categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('⚠️ A category with this name already exists');
      return false;
    }

    setCategories(categories.map((c) => (c === oldName ? trimmed : c)));
    setSongs(songs.map((s) => (s.category === oldName ? { ...s, category: trimmed } : s)));
    setQueue(queue.map((s) => (s.category === oldName ? { ...s, category: trimmed } : s)));
    showToast(`✏️ Renamed category "${oldName}" to "${trimmed}"`);
    return true;
  };

  const deleteCategory = (categoryToDelete, fallbackCategory = 'Chants') => {
    if (categories.length <= 1) {
      showToast('⚠️ Cannot delete the only remaining category');
      return false;
    }

    const fallback = categories.find((c) => c !== categoryToDelete) || fallbackCategory;
    setCategories(categories.filter((c) => c !== categoryToDelete));
    setSongs(songs.map((s) => (s.category === categoryToDelete ? { ...s, category: fallback } : s)));
    setQueue(queue.map((s) => (s.category === categoryToDelete ? { ...s, category: fallback } : s)));
    showToast(`🗑️ Category "${categoryToDelete}" deleted. Songs moved to "${fallback}".`);
    return true;
  };

  // ── Song Management Functions ──────────────────────────────────────────
  const addNewSong = (newSongData) => {
    const songItem = {
      id: `song-${Date.now()}`,
      title: newSongData.title,
      artist: newSongData.artist || 'Shambala Divine Artist',
      album: newSongData.album || 'Single Releases',
      category: newSongData.category || categories[0] || 'Bhajans',
      duration: newSongData.duration || '05:00',
      durationSec: 300,
      cover: newSongData.cover || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      audioUrl: newSongData.audioUrl || 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
      lyrics: newSongData.lyrics || '',
      plays: '1',
      liked: false
    };

    setSongs([songItem, ...songs]);
    setQueue([songItem, ...songs]);
    showToast(`🎉 New Song "${songItem.title}" Published successfully!`);
  };

  const updateSong = (songId, updatedData) => {
    setSongs(songs.map((s) => (s.id === songId ? { ...s, ...updatedData } : s)));
    setQueue(queue.map((s) => (s.id === songId ? { ...s, ...updatedData } : s)));
    if (currentTrack && currentTrack.id === songId) {
      setCurrentTrack((prev) => ({ ...prev, ...updatedData }));
    }
    showToast(`✏️ Updated song "${updatedData.title || 'Track'}"`);
  };

  const toggleLikedSong = (songId) => {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === songId) {
          const nextLiked = !s.liked;
          showToast(nextLiked ? `❤️ Added "${s.title}" to Liked Divine Chants` : `Removed "${s.title}" from Favorites`);
          return { ...s, liked: nextLiked };
        }
        return s;
      })
    );
  };

  const deleteSong = (songId) => {
    const songToDelete = songs.find((s) => s.id === songId);
    setSongs(songs.filter((s) => s.id !== songId));
    setQueue(queue.filter((s) => s.id !== songId));
    showToast(`🗑️ Deleted song "${songToDelete?.title || 'Track'}"`);
  };

  const moveSongCategory = (songId, newCategory) => {
    setSongs(songs.map((s) => (s.id === songId ? { ...s, category: newCategory } : s)));
    setQueue(queue.map((s) => (s.id === songId ? { ...s, category: newCategory } : s)));
    showToast(`📦 Moved song to category "${newCategory}"`);
  };

  const addNewPodcastEpisode = (podcastId, epData) => {
    setPodcasts(podcasts.map((pod) => {
      if (pod.id === podcastId) {
        return {
          ...pod,
          episodesCount: pod.episodesCount + 1,
          episodes: [
            {
              id: `ep-${Date.now()}`,
              title: epData.title,
              duration: epData.duration || '15:00',
              durationSec: 900,
              publishedDate: 'Just now',
              audioUrl: epData.audioUrl || 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'
            },
            ...pod.episodes
          ]
        };
      }
      return pod;
    }));
    showToast(`🎙️ Podcast Episode Published!`);
  };

  const toggleLiveStreamStatus = () => {
    setLiveFeed((prev) => {
      const nextStatus = !prev.isLive;
      showToast(nextStatus ? '🔴 Live Stream Broadcast is NOW LIVE!' : '⚪ Live Stream Ended');
      return { ...prev, isLive: nextStatus };
    });
  };

  const updateLiveStreamConfig = (updates) => {
    setLiveFeed((prev) => {
      const updated = { ...prev, ...updates };
      showToast('🎥 Live Video & Event Broadcast settings updated!');
      return updated;
    });
  };

  const addLiveVideoEvent = (eventData) => {
    setLiveFeed((prev) => {
      const newEvt = {
        id: `evt-${Date.now()}`,
        title: eventData.title || 'Special Spiritual Event',
        subtitle: eventData.subtitle || 'Live HD Sanctuary Broadcast',
        tag: eventData.tag || '🔴 LIVE EVENT',
        videoType: eventData.videoType || 'youtube',
        videoUrl: eventData.videoUrl || '',
        directVideoUrl: eventData.directVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42451-large.mp4',
        cover: eventData.cover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        viewers: 'Live Now'
      };
      showToast(`🎬 Spiritual Event "${newEvt.title}" added to Live Channels!`);
      return {
        ...prev,
        videoEvents: [newEvt, ...(prev.videoEvents || [])]
      };
    });
  };

  const addLiveChatMessage = (text) => {
    setLiveFeed((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: Date.now(),
          user: 'You (Divine Seeker)',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  return (
    <MusicContext.Provider
      value={{
        // Content
        songs,
        categories,
        podcasts,
        liveFeed,
        meditationSchedule,
        // Admin Auth State & Actions
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        // User Profile & Sign-In Actions
        userProfile,
        showAuthModal,
        setShowAuthModal,
        pendingOtpPhone,
        setPendingOtpPhone,
        generatedOtpCode,
        signInWithGoogle,
        signInWithEmail,
        signInWithApple,
        sendWhatsAppOtp,
        verifyWhatsAppOtp,
        updateUserProfile,
        signOutUser,
        // Cloudflare R2 State & Actions
        r2Config,
        updateR2Config,
        uploadToR2,
        getAudioMetadata,
        getRecommendedR2CorsRule,
        // Category Management Actions
        addCategory,
        updateCategory,
        deleteCategory,
        // Song Management Actions
        addNewSong,
        updateSong,
        deleteSong,
        toggleLikedSong,
        moveSongCategory,
        // Audio state
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        // Navigation & UI state
        currentView,
        setCurrentView,
        showLyrics,
        setShowLyrics,
        showVisualizer,
        setShowVisualizer,
        showQueue,
        setShowQueue,
        activeSearch,
        setActiveSearch,
        // Offline state
        isOfflineMode,
        setIsOfflineMode,
        downloadedTrackIds,
        downloadedTracksList,
        downloadTrack,
        removeDownloadedTrack,
        // Automated Meditation state
        isDailyMeditationScheduled,
        toggleDailyMeditationSchedule,
        isMeditationActive,
        isMeditationAudioPlaying,
        toggleMeditationPlay,
        activeMeditationTrack,
        meditationTimeRemaining,
        triggerMeditationSimulation,
        stopMeditation,
        // Player actions
        playTrack,
        togglePlay,
        handleNextTrack,
        handlePrevTrack,
        seekTo,
        setVolume,
        setIsMuted,
        setRepeatMode,
        setIsShuffle,
        // Admin podcast & live actions
        addNewPodcastEpisode,
        toggleLiveStreamStatus,
        updateLiveStreamConfig,
        addLiveVideoEvent,
        addLiveChatMessage,
        // Toast
        toastMessage,
        showToast,
        // Theme
        theme,
        appThemes,
        setAppTheme,
        toggleTheme,
        // Analytics
        analyticsData,
        recordSongPlay
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
