import '../models/song.dart';
import '../models/meditation.dart';
import '../models/podcast.dart';
import '../models/live_stream.dart';

final List<MeditationTrack> initialMeditationSchedule = [
  MeditationTrack(
    dayIndex: 1,
    dayName: 'Monday',
    title: 'Sacred Om 108 Chants & 528Hz Solfeggio',
    description: 'Transformative Monday 12:00 PM meditation invoking cellular repair and inner peace.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_monday.mp3',
    mantra: 'Om Namah Shivaya • Om Shanti Shanti Shanti',
  ),
  MeditationTrack(
    dayIndex: 2,
    dayName: 'Tuesday',
    title: 'Cosmic Krishna Flute & River Flow Harmony',
    description: 'Tuesday 12:00 PM session bringing tranquility, joy, and emotional healing.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_tuesday.mp3',
    mantra: 'Hare Krishna Hare Rama • Divine Love Frequency',
  ),
  MeditationTrack(
    dayIndex: 3,
    dayName: 'Wednesday',
    title: 'Shiva Tandava Stotram & Deep Tibetan Bowl',
    description: 'Wednesday 12:00 PM power meditation for focus, wisdom, and obstacle removal.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_wednesday.mp3',
    mantra: 'Om Gam Ganapataye Namaha • Divine Energy',
  ),
  MeditationTrack(
    dayIndex: 4,
    dayName: 'Thursday',
    title: 'Guru Divine Chants & Golden Light Aura',
    description: 'Thursday 12:00 PM meditation attuning to higher wisdom and spiritual grace.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_thursday.mp3',
    mantra: 'Gurur Brahma Gurur Vishnu • Eternal Light',
  ),
  MeditationTrack(
    dayIndex: 5,
    dayName: 'Friday',
    title: 'Sacred Divine Mother Shakti Stuti & Harp',
    description: 'Friday 12:00 PM meditation for cosmic compassion, abundance, and grace.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_friday.mp3',
    mantra: 'Ya Devi Sarva Bhuteshu • Supreme Grace',
  ),
  MeditationTrack(
    dayIndex: 6,
    dayName: 'Saturday',
    title: 'Deep Solfeggio 432Hz Chakra Alignment',
    description: 'Saturday 12:00 PM deep cleansing session aligning all 7 spiritual chakras.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_saturday.mp3',
    mantra: 'Om Mani Padme Hum • Infinite Cosmic Balance',
  ),
  MeditationTrack(
    dayIndex: 7,
    dayName: 'Sunday',
    title: 'Surya Gayatri & Golden Cosmic Light',
    description: 'Sunday 12:00 PM meditation invoking radiant solar vitality, divine light, and universal peace.',
    durationSec: 360,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/meditation_sunday.mp3',
    mantra: 'Om Suryaya Namaha • Om Bhur Bhuvah Svah',
  ),
];

final List<Song> initialSongs = [
  Song(
    id: 'song-1',
    title: 'Mahalakshmi Tapas (Divine Stuti)',
    artist: 'Happy Shambala Divine Chants',
    album: 'Sacred Tapas Vibrations',
    category: 'Mantras',
    duration: '28:45',
    durationSec: 1725,
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/mahalakshmi_tapas.mp3',
    plays: '248.5K',
    isLiked: true,
    lyrics: '''Om Shree Mahalakshmyai Namaha
Ya Devi Sarva Bhuteshu Lakshmi Rupena Samsthita
Namastasyai Namastasyai Namastasyai Namo Namaha

Meaning:
Salutations to Goddess Mahalakshmi, the embodiment of cosmic abundance, divine grace, and spiritual prosperity. May her sacred light bless all living beings with inner harmony.''',
  ),
  Song(
    id: 'song-2',
    title: '10 Ganesha Tapas (Obstacle Removal)',
    artist: 'Shambala Vedic Chants',
    album: 'Sacred Tapas Vibrations',
    category: 'Chants',
    duration: '18:32',
    durationSec: 1112,
    coverUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/ganesha_tapas_10.mp3',
    plays: '194.2K',
    isLiked: true,
    lyrics: '''Vakratunda Mahakaya Surya Koti Samaprabha
Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada

Meaning:
O Lord Ganesha with a curved trunk and mighty body, whose brilliance equals ten million suns, please remove all obstacles from our endeavors forever.''',
  ),
  Song(
    id: 'song-3',
    title: '100 Ganesh Tapas (108 Divine Names)',
    artist: 'Celestial Soundscapes',
    album: 'Cosmic Tapas Chants',
    category: 'Ambient',
    duration: '19:40',
    durationSec: 1180,
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'assets/audio/ganesh_tapas_100.mp3',
    plays: '312.8K',
    isLiked: false,
    lyrics: '''Om Vinayakaya Namaha • Om Vighnarajaya Namaha • Om Ganadhayakshaya Namaha

Deep meditation invocation invoking 100 divine names of Lord Ganesha for clarity, spiritual strength, and victory.''',
  ),
  Song(
    id: 'song-4',
    title: 'Gayatri Mantra & 528Hz Solfeggio Waves',
    artist: 'Celestial Soundscapes',
    album: 'Cosmic Light Vibrations',
    category: 'Ambient',
    duration: '05:45',
    durationSec: 345,
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    plays: '98.4K',
    isLiked: false,
    lyrics: '''Om Bhur Bhuvaḥ Swaḥ
Tat-savitur Vareṇyaṁ
Bhargo Devasya Dhīmahi
Dhiyo Yo Naḥ Prachodayāt

Meaning:
We meditate on the glory of the Creator; Who has created the Universe; Who is worthy of Worship; Who is the embodiment of Knowledge and Light; Who is the remover of all Sin and Ignorance; May He enlighten our Intellect.''',
  ),
  Song(
    id: 'song-5',
    title: 'Achutam Keshavam Krishna Damodaram',
    artist: 'Shambala Divine Choir',
    album: 'Devotional Bhajans',
    category: 'Bhajans',
    duration: '04:30',
    durationSec: 270,
    coverUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
    plays: '215.3K',
    isLiked: true,
    lyrics: '''Achyutam Keshavam Krishna Damodaram
Rama Narayanam Janaki Vallabham

Kaun Kehta Hai Bhagwan Aate Nahi
Tum Meera Ke Jaise Bulate Nahi''',
  ),
];

final List<PodcastShow> initialPodcasts = [
  PodcastShow(
    id: 'pod-1',
    title: 'Spiritual Wisdom & Mindful Awakening',
    host: 'Gurudev Shambala',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    description: 'Weekly deep talks on self-realization, ancient scriptures, meditation techniques, and living with inner peace.',
    episodes: [
      PodcastEpisode(
        id: 'ep-101',
        title: 'Ep 24: Finding Silence in a Noisy World',
        duration: '18:40',
        durationSec: 1120,
        publishedDate: 'Aug 10, 2026',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
      ),
      PodcastEpisode(
        id: 'ep-102',
        title: 'Ep 23: The Science of 12:00 PM Noon Meditation',
        duration: '15:20',
        durationSec: 920,
        publishedDate: 'Aug 03, 2026',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      ),
    ],
  ),
];

final LiveStreamFeed initialLiveFeed = LiveStreamFeed(
  id: 'live-feed-1',
  title: 'Shambala 24/7 Global Divine Satsang & Chanting Stream',
  broadcaster: 'Shambala Divine Ashram',
  isLive: true,
  listenerCount: 1420,
  coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
  audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
  chatMessages: [
    ChatMessage(id: '1', user: 'Aarav M.', text: 'Om Shanti! Blessed to join this divine stream 🙏', time: '12:02 PM'),
    ChatMessage(id: '2', user: 'Priya S.', text: 'The flute music is so calming today...', time: '12:03 PM'),
    ChatMessage(id: '3', user: 'Devi Prasad', text: 'Jai Gurudev! Greetings from California 🕉️', time: '12:04 PM'),
  ],
);
