import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Download, 
  Check, 
  Radio, 
  Clock, 
  Flame,
  ChevronRight,
  ChevronLeft,
  Heart,
  Search,
  Music,
  Disc
} from 'lucide-react';

export const HomeView = () => {
  const { 
    songs, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    toggleLikedSong,
    activeSearch, 
    setActiveSearch,
    downloadedTrackIds, 
    downloadTrack,
    setCurrentView,
    triggerMeditationSimulation,
    meditationSchedule,
    liveFeed
  } = useMusic();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = ['All', 'Mantras', 'Bhajans', 'Chants', 'Ambient', 'Instrumental'];

  // Current day's meditation track (0 = Sunday -> dayIndex 7, 1 = Monday -> dayIndex 1, etc.)
  const dayOfWeek = new Date().getDay();
  const targetDayIdx = dayOfWeek === 0 ? 7 : dayOfWeek;
  const todaysMeditation = meditationSchedule.find((m) => m.dayIndex === targetDayIdx) || meditationSchedule[0];

  // Featured Explore Collections (Grid cards from Reference Image 2 Screen 3)
  const exploreCollections = [
    { title: 'Devi Chants', count: '128 Songs', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', cat: 'Chants' },
    { title: 'Shiva Mantras', count: '96 Songs', cover: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80', cat: 'Mantras' },
    { title: 'Vishnu Bhajans', count: '86 Songs', cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', cat: 'Bhajans' },
    { title: 'Ganesh Chants', count: '74 Songs', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', cat: 'Chants' },
    { title: 'Meditation Music', count: '120 Songs', cover: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=800&q=80', cat: 'Ambient' },
    { title: 'Healing Frequencies', count: '64 Songs', cover: 'https://images.unsplash.com/photo-1528319725582-ddc09f38b617?auto=format&fit=crop&w=800&q=80', cat: 'Ambient' },
  ];

  // 4 Interactive Hero Slides
  const slides = [
    {
      id: 0,
      badge: 'DAILY DIVINE LISTENING',
      title: 'Divine Music for a Higher Life',
      subtitle: 'Mantras • Bhajans • Slokas • Spiritual Podcasts • Meditation Music',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      actionText: (currentTrack && isPlaying) ? 'Pause Now' : 'Play Now',
      isPlayingAction: !!(currentTrack && isPlaying),
      onAction: () => {
        if (currentTrack) {
          playTrack(currentTrack);
        } else {
          playTrack(songs[0], songs);
        }
      }
    },
    {
      id: 1,
      badge: 'SHARP 12:00 PM MEDITATION',
      title: `Today: ${todaysMeditation.dayName} Session`,
      subtitle: `${todaysMeditation.title} — ${todaysMeditation.description}`,
      cover: todaysMeditation.cover,
      actionText: 'Start Session',
      onAction: () => triggerMeditationSimulation(targetDayIdx)
    },
    {
      id: 2,
      badge: '24/7 LIVE SATSANG',
      title: 'Global Chanting Stream',
      subtitle: 'Join 1.2K+ seekers tuned in live for continuous Satsang & Vedic talks.',
      cover: liveFeed.cover,
      actionText: 'Tune In Live',
      onAction: () => setCurrentView('live')
    }
  ];

  // Auto-play Hero Slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  // Filter songs based on search query and category
  const filteredSongs = songs.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
                          s.artist.toLowerCase().includes(activeSearch.toLowerCase()) ||
                          s.category.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-32 animate-fadeIn">
      
      {/* ── Brand Title Banner (Reference Image 2 Header) ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/30 flex items-center justify-center shadow-md flex-shrink-0">
            <img src="/logo.png" alt="Happy Shambala Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-heading font-black text-lg md:text-xl text-white tracking-wider leading-none">
              HAPPY SHAMBALA
            </h1>
            <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
              Awakening Avadhanies
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero Slider Banner (Reference Image 2 Screen 2) ── */}
      <div className="hero-banner-card relative rounded-3xl overflow-hidden border border-amber-500/35 p-6 md:p-8 min-h-[260px] flex flex-col justify-between shadow-2xl bg-gradient-to-r from-[#25081E] via-[#3A0C2E] to-[#12071F]">
        {/* Glow Aura */}
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Content */}
        <div key={currentSlide.id} className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
          <div className="space-y-3 text-center md:text-left flex-1">
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400/25 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest border border-amber-400/40">
              {currentSlide.badge}
            </span>

            <h2 className="font-heading font-extrabold text-2xl md:text-4xl text-white leading-tight">
              {currentSlide.title}
            </h2>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-lg font-medium">
              {currentSlide.subtitle}
            </p>

            <div className="pt-2 flex justify-center md:justify-start">
              <button
                onClick={currentSlide.onAction}
                className="btn-primary btn-crimson text-xs md:text-sm py-3 px-8 cursor-pointer flex items-center gap-2 font-bold shadow-xl"
              >
                {currentSlide.isPlayingAction ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>{currentSlide.actionText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Artwork Card */}
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 flex-shrink-0">
            <img 
              src={currentSlide.cover} 
              alt={currentSlide.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Dots Pagination */}
        <div className="relative z-10 flex items-center justify-center gap-2 pt-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Category Pill Tags Bar (Reference Image 1 Screen 2 & Image 2 Screen 3) ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'pill-solar-yellow text-slate-950 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-amber-500/25 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Continue Listening Card ── */}
      {currentTrack && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xl text-white">
              Continue Listening
            </h3>
            <span
              onClick={() => playTrack(currentTrack)}
              className="text-xs text-amber-400 font-bold cursor-pointer hover:underline"
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </span>
          </div>

          <div
            onClick={() => playTrack(currentTrack)}
            className="glass-panel p-4 rounded-3xl border border-amber-500/25 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-400/50 transition-all shadow-lg"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-2xl object-cover border border-amber-400/30 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-base text-white truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-slate-400 text-xs truncate mt-0.5">
                  {currentTrack.artist}
                </p>
                <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all"
                    style={{ width: isPlaying ? '65%' : '45%' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playTrack(currentTrack);
              }}
              className="btn-play-crimson hover:scale-105 transition-all shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Explore Categories Grid (2-Column Artwork Tiles from Reference Image 2 Screen 3) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl text-white">
            Explore Collections
          </h3>
          <span className="text-xs text-amber-400 font-bold cursor-pointer hover:underline">
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {exploreCollections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCategory(item.cat)}
              className="collection-tile-overlay relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-amber-500/30 cursor-pointer group hover:scale-105 transition-transform"
            >
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
                <h4 className="text-white font-extrabold text-xs group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-300 font-mono">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divine Song Track List (My Library from Reference Image 1 Screen 2 & Image 2 Screen 5) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl text-white">
            My Library & Divine Songs ({filteredSongs.length})
          </h3>
        </div>

        <div className="space-y-3">
          {filteredSongs.map((song, idx) => {
            const isThisPlaying = currentTrack?.id === song.id && isPlaying;
            const isDownloaded = downloadedTrackIds.includes(song.id);
            const isSelected = currentTrack?.id === song.id;

            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer group border ${
                  isSelected
                    ? 'active-song-row border-rose-500/50 shadow-md'
                    : 'glass-panel glass-panel-hover border-amber-500/20'
                }`}
              >
                <div 
                  onClick={() => playTrack(song, filteredSongs)}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  {isThisPlaying ? (
                    <div className="w-5 flex items-end justify-center gap-0.5 h-4 shrink-0">
                      <span className="w-1 bg-rose-500 rounded-full eq-bar-1" />
                      <span className="w-1 bg-amber-500 rounded-full eq-bar-2" />
                      <span className="w-1 bg-rose-500 rounded-full eq-bar-3" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                      {idx + 1}
                    </span>
                  )}

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 shadow-md">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity ${
                      isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {isThisPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white ml-0.5" />}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-rose-600' : 'text-white group-hover:text-amber-400'}`}>
                        {song.title}
                      </h4>
                      <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold shrink-0">
                        {song.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs truncate mt-0.5 font-medium">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
                    {song.duration}
                  </span>

                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikedSong(song.id);
                    }}
                    title={song.liked ? 'Remove from Favorites' : 'Add to Favorites'}
                    className={`p-1.5 hover:scale-125 transition-transform cursor-pointer ${
                      song.liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${song.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDownloaded) downloadTrack(song);
                    }}
                    className={`p-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      isDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
