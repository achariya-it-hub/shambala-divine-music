import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Download, Play, Pause, Trash2, WifiOff, HardDrive, Check } from 'lucide-react';

export const OfflineManager = () => {
  const { 
    downloadedTracksList, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    removeDownloadedTrack,
    isOfflineMode,
    setIsOfflineMode
  } = useMusic();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-3xl text-white">Offline Divine Library</h2>
            <p className="text-slate-400 text-sm">Tracks cached directly in IndexedDB for internet-free listening</p>
          </div>
        </div>

        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs shadow-lg transition-all ${
            isOfflineMode
              ? 'bg-amber-400 text-slate-950 shadow-amber-500/30'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          <WifiOff className="w-4 h-4" />
          <span>{isOfflineMode ? 'Offline Mode Active' : 'Toggle Test Offline Mode'}</span>
        </button>
      </div>

      {/* Storage Stat Pill */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-4 text-xs text-slate-300">
        <HardDrive className="w-5 h-5 text-amber-400" />
        <div>
          <span className="font-bold text-white">{downloadedTracksList.length} Tracks Cached</span>
          <span className="text-slate-500 ml-2">| High-Fidelity Local IndexedDB Audio Blobs</span>
        </div>
      </div>

      {/* Track List */}
      {downloadedTracksList.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 space-y-4">
          <Download className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Offline Downloads Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Click the download icon on any divine song to save it for offline playback without internet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloadedTracksList.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 group hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => playTrack(track, downloadedTracksList)}
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isThisPlaying ? <Pause className="w-6 h-6 text-amber-400 fill-amber-400" /> : <Play className="w-6 h-6 text-amber-400 fill-amber-400 ml-0.5" />}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{track.title}</h4>
                    <p className="text-slate-400 text-xs truncate">{track.artist}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                      <Check className="w-3 h-3" /> IndexedDB Saved
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeDownloadedTrack(track.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove Download"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
