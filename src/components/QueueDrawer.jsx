import React from 'react';
import { useMusic } from '../context/MusicContext';
import { X, ListMusic, Play, Download, Check } from 'lucide-react';

export const QueueDrawer = () => {
  const { 
    showQueue, 
    setShowQueue, 
    queue, 
    queueIndex, 
    currentTrack, 
    playTrack,
    downloadedTrackIds,
    downloadTrack
  } = useMusic();

  if (!showQueue) return null;

  return (
    <div className="drawer-panel fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#0c0a18]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-slideLeft">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-lg text-white">Playback Queue</h3>
          </div>
          <button
            onClick={() => setShowQueue(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Now Playing Section */}
        {currentTrack && (
          <div className="my-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Now Playing
            </span>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-12 h-12 rounded-xl object-cover" 
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-bold truncate">{currentTrack.title}</h4>
                <p className="text-slate-400 text-xs truncate">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Next Up ({queue.length})
          </span>

          <div className="overflow-y-auto max-h-[calc(100vh-320px)] space-y-2 pr-1">
            {queue.map((track, idx) => {
              const isCurrent = idx === queueIndex;
              const isDownloaded = downloadedTrackIds.includes(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, queue)}
                  className={`p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                    isCurrent 
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' 
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="w-5 text-center text-xs text-slate-500 font-mono">{idx + 1}</span>
                  <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-white truncate">{track.title}</h5>
                    <p className="text-slate-400 text-xs truncate">{track.artist}</p>
                  </div>
                  {isDownloaded && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
