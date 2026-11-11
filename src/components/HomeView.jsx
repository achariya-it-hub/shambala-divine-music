import React from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Radio, 
  Flame, 
  Check, 
  Download, 
  Music,
  Clock
} from 'lucide-react';

export default function HomeView() {
  const { 
    songs, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory,
    meditationSchedule,
    isDailyMeditationScheduled,
    toggleDailyMeditationSchedule,
    triggerMeditationSimulation,
    liveFeed,
    downloadSong,
    downloadedSongs,
    removeDownloadedSong
  } = useMusic();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const targetDayIdx = dayOfWeek === 0 ? 7 : dayOfWeek;
  const todaysMeditation = meditationSchedule.find((m) => m.dayIndex === targetDayIdx) || meditationSchedule[0];

  const categories = ['All', 'Mantras', 'Bhajans', 'Ambient', 'Chants', 'Instrumental'];

  const filteredSongs = songs.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Hero 12:00 PM Meditation Card */}
      <div className="relative overflow-hidden rounded-3xl p-8 card-3d bg-gradient-to-br from-purple-950/90 via-slate-950/95 to-amber-950/50">
        {/* Background Glowing Orb */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl animate-pulse-aura pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border-t border-l border-amber-400/50 border-b border-amber-600/60 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-lg shadow-amber-500/10">
              <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center icon-3d-svg">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
              </div>
              <span>AUTOMATED SHARP 12:00 PM – 12:06 PM MEDITATION</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-wide">
              Today's Sacred Session: <span className="text-gold-gradient">{todaysMeditation.dayName}</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              <strong className="text-amber-200">{todaysMeditation.title}</strong> — {todaysMeditation.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => triggerMeditationSimulation(targetDayIdx)}
                className="btn-3d-gold text-xs uppercase tracking-wider"
              >
                <span className="text-base">🧘</span>
                <span>Start 12:00 PM Session Now</span>
              </button>

              <button
                onClick={toggleDailyMeditationSchedule}
                className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-full border-t border-l border-b transition-all duration-300 shadow-inner ${
                  isDailyMeditationScheduled
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 border-b-black shadow-emerald-500/20'
                    : 'bg-black/60 text-amber-300/90 border-amber-500/40 border-b-black'
                }`}
              >
                {isDailyMeditationScheduled ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 icon-3d-svg" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-400 icon-3d-svg" />
                )}
                <span>
                  {isDailyMeditationScheduled
                    ? 'Scheduled for Everyday @ 12:00 PM (Click to Cancel)'
                    : 'Schedule Everyday @ 12:00 PM'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Artwork Box */}
          <div className="relative group shrink-0 hidden md:block">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-amber-300 group-hover:shadow-amber-500/30">
              <img 
                src={todaysMeditation.cover || todaysMeditation.coverUrl} 
                alt="Meditation Session" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/90 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border-t border-amber-400/50 shadow-lg whitespace-nowrap">
              7 Days • 7 Sacred Compositions
            </div>
          </div>
        </div>
      </div>

      {/* 24/7 Live Satsang Alert Banner */}
      {liveFeed.isLive && (
        <div className="card-3d rounded-2xl p-4 border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl icon-3d-badge bg-rose-500/30 text-rose-300 shrink-0">
              <Radio className="w-6 h-6 animate-pulse icon-3d-svg" />
              <div className="absolute inset-0 rounded-2xl bg-rose-500/20 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-md shadow-rose-500" />
                <span className="text-xs font-bold text-rose-300 tracking-wider">LIVE SATSANG BROADCASTING</span>
              </div>
              <h3 className="text-base font-heading font-bold text-white">{liveFeed.title}</h3>
              <p className="text-xs text-slate-400">{liveFeed.listenerCount} Seekers Listening Live</p>
            </div>
          </div>

          <button 
            onClick={() => playTrack({
              id: liveFeed.id,
              title: liveFeed.title,
              artist: liveFeed.broadcaster,
              album: '24/7 Live Stream',
              category: 'Live Broadcast',
              duration: 'LIVE',
              coverUrl: liveFeed.coverUrl,
              audioUrl: liveFeed.audioUrl,
              lyrics: '🔴 LIVE SATSANG BROADCAST'
            })}
            className="btn-3d-rose text-xs tracking-wider shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current icon-3d-svg" />
            <span>Join Live Broadcast</span>
          </button>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? 'btn-3d-gold text-slate-950 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-t border-l border-white/15 border-b border-black/40 shadow-md hover:translate-y-[-2px]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Quick Play 6-Card Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl icon-3d-badge bg-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 icon-3d-svg" />
          </div>
          <h2 className="text-lg font-heading font-bold text-white tracking-wide">QUICK PLAY DIVINE TRACKS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {songs.slice(0, 6).map((song) => {
            const isPlayingThis = currentTrack?.id === song.id && isPlaying;
            const isCurrent = currentTrack?.id === song.id;

            return (
              <div
                key={song.id}
                onClick={() => playTrack(song, songs)}
                className={`group card-3d rounded-2xl p-2.5 flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                  isCurrent 
                    ? 'border-amber-400/80 bg-amber-500/15 shadow-xl shadow-amber-500/15 scale-[1.02]' 
                    : 'hover:border-amber-400/40 hover:bg-white/10'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/20">
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {isPlayingThis ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-amber-400 animate-bounce h-full" />
                        <span className="w-1 bg-amber-400 animate-bounce h-2/3" style={{ animationDelay: '0.15s' }} />
                        <span className="w-1 bg-amber-400 animate-bounce h-4/5" style={{ animationDelay: '0.3s' }} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full btn-3d-icon-play">
                        <Play className="w-4 h-4 text-slate-950 fill-current ml-0.5 icon-3d-svg" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-amber-400' : 'text-white group-hover:text-amber-300'}`}>
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sacred Divine Releases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl icon-3d-badge bg-amber-500/20 text-amber-400 shrink-0">
              <Music className="w-4 h-4 text-amber-400 icon-3d-svg" />
            </div>
            <h2 className="text-lg font-heading font-bold text-white tracking-wide">
              SACRED DIVINE RELEASES ({filteredSongs.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border-t border-l border-amber-400/40 border-b border-black shadow-md">
            Offline & Online Stream
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSongs.map((song) => {
            const isPlayingThis = currentTrack?.id === song.id && isPlaying;
            const isDownloaded = downloadedSongs.some(d => d.id === song.id);

            return (
              <div
                key={song.id}
                className="group card-3d rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
                onClick={() => playTrack(song, filteredSongs)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/15 shadow-md">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${
                    isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <div className="w-11 h-11 rounded-full btn-3d-icon-play transform group-hover:scale-110 transition-transform">
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 fill-current text-slate-950 icon-3d-svg" />
                      ) : (
                        <Play className="w-5 h-5 fill-current text-slate-950 ml-0.5 icon-3d-svg" />
                      )}
                    </div>
                  </div>

                  {/* Offline Download Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDownloaded) {
                        removeDownloadedSong(song.id);
                      } else {
                        downloadSong(song);
                      }
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-lg ${
                      isDownloaded 
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/50 border-t border-emerald-300' 
                        : 'bg-black/70 text-slate-300 hover:bg-amber-500 hover:text-slate-950 border-t border-white/20'
                    }`}
                    title={isDownloaded ? "Saved Offline" : "Download for Offline Listening"}
                  >
                    {isDownloaded ? <Check className="w-3.5 h-3.5 icon-3d-svg" /> : <Download className="w-3.5 h-3.5 icon-3d-svg" />}
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
