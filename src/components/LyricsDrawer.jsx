import React from 'react';
import { useMusic } from '../context/MusicContext';
import { X, FileText, Sparkles, BookOpen } from 'lucide-react';

export const LyricsDrawer = () => {
  const { showLyrics, setShowLyrics, currentTrack } = useMusic();

  if (!showLyrics || !currentTrack) return null;

  return (
    <div className="drawer-panel fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#0c0a18]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-slideLeft">
      {/* Drawer Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-white">Divine Lyrics & Mantras</h3>
          </div>
          <button
            onClick={() => setShowLyrics(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Title Info */}
        <div className="flex items-center gap-3 my-6">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-14 h-14 rounded-xl object-cover border border-amber-400/30"
          />
          <div>
            <h4 className="text-white font-bold text-sm leading-snug">{currentTrack.title}</h4>
            <p className="text-slate-400 text-xs">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Lyrics Content Container */}
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 space-y-4">
          {currentTrack.lyrics ? (
            <div className="whitespace-pre-line text-slate-200 text-sm leading-relaxed font-sans bg-white/5 p-4 rounded-2xl border border-white/5">
              {currentTrack.lyrics}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Sparkles className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
              <p className="text-sm">Pure Instrumentals / Ambient Divine Soundscape</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10 text-center">
        <span className="text-[11px] text-amber-400/80 font-medium">
          🕉️ Repetition & Meditation enhances inner clarity
        </span>
      </div>
    </div>
  );
};
