// Initial Divine Songs, Podcasts, Daily Meditation Tracks, & Live Audio Streams

export const DAILY_MEDITATION_SCHEDULE = [
  {
    dayIndex: 1,
    dayName: 'Monday',
    title: 'Sacred Om 108 Chants & 528Hz Solfeggio',
    description: 'Transformative Monday 12:00 PM meditation invoking cellular repair and inner peace.',
    durationSec: 360, // 6 minutes (12:00 PM - 12:06 PM)
    cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_monday.mp3', // High quality ambient audio
    synthType: 'om_528',
    mantra: 'Om Namah Shivaya • Om Shanti Shanti Shanti'
  },
  {
    dayIndex: 2,
    dayName: 'Tuesday',
    title: 'Cosmic Krishna Flute & River Flow Harmony',
    description: 'Tuesday 12:00 PM session bringing tranquility, joy, and emotional healing.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_tuesday.mp3',
    synthType: 'flute_bowl',
    mantra: 'Hare Krishna Hare Rama • Divine Love Frequency'
  },
  {
    dayIndex: 3,
    dayName: 'Wednesday',
    title: 'Shiva Tandava Stotram & Deep Tibetan Bowl',
    description: 'Wednesday 12:00 PM power meditation for focus, wisdom, and obstacle removal.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_wednesday.mp3',
    synthType: 'om_528',
    mantra: 'Om Gam Ganapataye Namaha • Divine Energy'
  },
  {
    dayIndex: 4,
    dayName: 'Thursday',
    title: 'Guru Divine Chants & Golden Light Aura',
    description: 'Thursday 12:00 PM meditation attuning to higher wisdom and spiritual grace.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_thursday.mp3',
    synthType: 'flute_bowl',
    mantra: 'Gurur Brahma Gurur Vishnu • Eternal Light'
  },
  {
    dayIndex: 5,
    dayName: 'Friday',
    title: 'Sacred Divine Mother Shakti Stuti & Harp',
    description: 'Friday 12:00 PM meditation for cosmic compassion, abundance, and grace.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_friday.mp3',
    synthType: 'om_528',
    mantra: 'Ya Devi Sarva Bhuteshu • Supreme Grace'
  },
  {
    dayIndex: 6,
    dayName: 'Saturday',
    title: 'Deep Solfeggio 432Hz Chakra Alignment',
    description: 'Saturday 12:00 PM deep cleansing session aligning all 7 spiritual chakras.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_saturday.mp3',
    synthType: 'flute_bowl',
    mantra: 'Om Mani Padme Hum • Infinite Cosmic Balance'
  },
  {
    dayIndex: 7,
    dayName: 'Sunday',
    title: 'Surya Gayatri & Golden Cosmic Light',
    description: 'Sunday 12:00 PM meditation invoking radiant solar vitality, divine light, and universal peace.',
    durationSec: 360,
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/meditation_sunday.mp3',
    synthType: 'om_528',
    mantra: 'Om Suryaya Namaha • Om Bhur Bhuvah Svah'
  }
];

export const INITIAL_SONGS = [
  {
    id: 'song-1',
    title: 'Mahalakshmi Tapas (Divine Stuti)',
    artist: 'Happy Shambala Divine Chants',
    album: 'Sacred Tapas Vibrations',
    category: 'Mantras',
    duration: '28:45',
    durationSec: 1725,
    cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/mahalakshmi_tapas.mp3',
    plays: '248.5K',
    liked: true,
    lyrics: `Om Shree Mahalakshmyai Namaha
Ya Devi Sarva Bhuteshu Lakshmi Rupena Samsthita
Namastasyai Namastasyai Namastasyai Namo Namaha

Meaning:
Salutations to Goddess Mahalakshmi, the embodiment of cosmic abundance, divine grace, and spiritual prosperity. May her sacred light bless all living beings with inner harmony.`
  },
  {
    id: 'song-2',
    title: '10 Ganesha Tapas (Obstacle Removal)',
    artist: 'Shambala Vedic Chants',
    album: 'Sacred Tapas Vibrations',
    category: 'Chants',
    duration: '18:32',
    durationSec: 1112,
    cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/ganesha_tapas_10.mp3',
    plays: '194.2K',
    liked: true,
    lyrics: `Vakratunda Mahakaya Surya Koti Samaprabha
Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada

Meaning:
O Lord Ganesha with a curved trunk and mighty body, whose brilliance equals ten million suns, please remove all obstacles from our endeavors forever.`
  },
  {
    id: 'song-3',
    title: '100 Ganesh Tapas (108 Divine Names)',
    artist: 'Celestial Soundscapes',
    album: 'Cosmic Tapas Chants',
    category: 'Ambient',
    duration: '19:40',
    durationSec: 1180,
    cover: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: '/ganesh_tapas_100.mp3',
    plays: '312.8K',
    liked: false,
    lyrics: `Om Vinayakaya Namaha • Om Vighnarajaya Namaha • Om Ganadhayakshaya Namaha

Deep meditation invocation invoking 100 divine names of Lord Ganesha for clarity, spiritual strength, and victory.`
  },
  {
    id: 'song-4',
    title: 'Gayatri Mantra & 528Hz Solfeggio Waves',
    artist: 'Celestial Soundscapes',
    album: 'Cosmic Light Vibrations',
    category: 'Ambient',
    duration: '05:45',
    durationSec: 345,
    cover: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    plays: '98.4K',
    liked: false,
    lyrics: `Om Bhur Bhuvaḥ Swaḥ
Tat-savitur Vareṇyaṁ
Bhargo Devasya Dhīmahi
Dhiyo Yo Naḥ Prachodayāt

Meaning:
We meditate on the glory of the Creator; Who has created the Universe; Who is worthy of Worship; Who is the embodiment of Knowledge and Light; Who is the remover of all Sin and Ignorance; May He enlighten our Intellect.`
  },
  {
    id: 'song-5',
    title: 'Achutam Keshavam Krishna Damodaram',
    artist: 'Shambala Divine Choir',
    album: 'Devotional Bhajans',
    category: 'Bhajans',
    duration: '04:30',
    durationSec: 270,
    cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
    plays: '215.3K',
    liked: true,
    lyrics: `Achyutam Keshavam Krishna Damodaram
Rama Narayanam Janaki Vallabham

Kaun Kehta Hai Bhagwan Aate Nahi
Tum Meera Ke Jaise Bulate Nahi`
  }
];

export const INITIAL_PODCASTS = [
  {
    id: 'pod-1',
    title: 'Spiritual Wisdom & Mindful Awakening',
    host: 'Gurudev Shambala',
    cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    episodesCount: 24,
    description: 'Weekly deep talks on self-realization, ancient scriptures, meditation techniques, and living with inner peace.',
    episodes: [
      {
        id: 'ep-101',
        title: 'Ep 24: Finding Silence in a Noisy World',
        duration: '18:40',
        durationSec: 1120,
        publishedDate: 'Aug 10, 2026',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3'
      },
      {
        id: 'ep-102',
        title: 'Ep 23: The Science of 12:00 PM Noon Meditation',
        duration: '15:20',
        durationSec: 920,
        publishedDate: 'Aug 03, 2026',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'
      }
    ]
  },
  {
    id: 'pod-2',
    title: 'Vedic Chanting & Sound Healing Secrets',
    host: 'Dr. Arya Sharma',
    cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    episodesCount: 16,
    description: 'Exploring sound vibration frequency, Sanskrit pronunciation, and the healing power of sacred mantras.',
    episodes: [
      {
        id: 'ep-201',
        title: 'Ep 16: 528Hz Love Frequency & DNA Healing',
        duration: '22:15',
        durationSec: 1335,
        publishedDate: 'Aug 08, 2026',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3'
      }
    ]
  }
];

export const LIVE_AUDIO_FEED = {
  id: 'live-feed-1',
  title: 'Shambala 24/7 Global Divine Satsang & Chanting Stream',
  broadcaster: 'Shambala Divine Ashram',
  isLive: true,
  streamMode: 'video', // 'video' | 'audio'
  videoType: 'youtube', // 'youtube' | 'hls' | 'cloudflare'
  videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&rel=0',
  listenerCount: 1420,
  cover: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
  audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
  activeEventIndex: 0,
  videoEvents: [
    {
      id: 'evt-1',
      title: 'Live Maha Aarti & Divine Darshan',
      subtitle: 'Shambala Main Sanctuary • HD 1080p Live Video',
      tag: '🔴 LIVE NOW',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A?rel=0',
      directVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42451-large.mp4',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      viewers: '1.4K watching'
    },
    {
      id: 'evt-2',
      title: 'Vedic Homa & Rudra Abhishekam Ceremony',
      subtitle: 'Sacred Fire Ritual & 108 Mantras • Multi-Cam Stream',
      tag: '🔥 SACRED RITUAL',
      videoType: 'direct',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-incense-smoke-rising-in-slow-motion-42449-large.mp4',
      directVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-incense-smoke-rising-in-slow-motion-42449-large.mp4',
      cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      viewers: '890 watching'
    },
    {
      id: 'evt-3',
      title: 'Evening Satsang & Discourse with Gurudev',
      subtitle: 'Q&A, Guided Dhyana & Bhajan Kirtan • Live Hall',
      tag: '🕉️ SATSANG',
      videoType: 'direct',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunlight-through-the-trees-in-a-forest-1220-large.mp4',
      directVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunlight-through-the-trees-in-a-forest-1220-large.mp4',
      cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      viewers: '1.1K watching'
    }
  ],
  chatMessages: [
    { id: 1, user: 'Aarav M.', text: 'Om Shanti! Blessed to join this divine video darshan 🙏', time: '12:02 PM' },
    { id: 2, user: 'Priya S.', text: 'Watching the Maha Aarti live with my family, so peaceful ✨', time: '12:03 PM' },
    { id: 3, user: 'Devi Prasad', text: 'Jai Gurudev! Clear HD stream from California 🕉️', time: '12:04 PM' }
  ]
};
