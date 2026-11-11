import React from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Sparkles, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export const MeditationModal = () => {
  const { 
    isMeditationActive, 
    activeMeditationTrack, 
    meditationTimeRemaining, 
    stopMeditation,
    isMeditationAudioPlaying,
    toggleMeditationPlay,
    volume,
    setVolume,
    isMuted,
    setIsMuted
  } = useMusic();

  if (!isMeditationActive || !activeMeditationTrack) return null;

  const minutes = Math.floor(meditationTimeRemaining / 60);
  const seconds = meditationTimeRemaining % 60;
  const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  return (
    <div className="meditation-overlay fixed inset-0 z-50 bg-[#06050b]/95 backdrop-blur-3xl flex flex-col items-center justify-between p-6 md:p-8 text-center animate-fadeIn">
      {/* Background Pulse Aura */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/10 to-cyan-500/20 blur-3xl animate-pulse-aura pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-amber-400 text-xs md:text-sm font-semibold tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Automated 12:00 PM Noon Meditation</span>
        </div>

        <button
          onClick={stopMeditation}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Close Session"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Meditation Content */}
      <div className="max-w-2xl z-10 flex flex-col items-center gap-5 my-auto">
        {/* Day Badge */}
        <div className="px-5 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/10">
          {activeMeditationTrack.dayName} Sacred Session
        </div>

        {/* Circular Countdown Timer & Artwork */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400/40" />
          <div className="w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl shadow-amber-500/30">
            <img 
              src={activeMeditationTrack.cover || activeMeditationTrack.coverUrl} 
              alt={activeMeditationTrack.title}
              className="w-full h-full object-cover animate-float"
            />
          </div>
          {/* Centered Countdown Timer Badge */}
          <div className="absolute bottom-[-15px] bg-[#0c0a18] border border-amber-400/60 text-amber-300 font-mono font-extrabold text-lg px-4 py-1 rounded-full shadow-xl">
            {formattedTime}
          </div>
        </div>

        {/* Track Info & Description */}
        <div className="mt-3">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-2 tracking-wide">
            {activeMeditationTrack.title}
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-lg mx-auto">
            {activeMeditationTrack.description}
          </p>
        </div>

        {/* Sacred Mantra Display */}
        {activeMeditationTrack.mantra && (
          <div className="glass-panel glass-gold-border px-6 py-3.5 rounded-2xl max-w-xl">
            <div className="text-amber-300 font-bold text-base md:text-lg font-heading tracking-widest">
              {activeMeditationTrack.mantra}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Breathe in light. Release all tension during these 6 divine minutes.
            </span>
          </div>
        )}

        {/* Play / Pause & Audio Controls Pill */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={toggleMeditationPlay}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer ${
              isMeditationAudioPlaying
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-600/30 hover:scale-105'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/30 hover:scale-105 animate-pulse'
            }`}
          >
            {isMeditationAudioPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white text-white" />
                <span>Pause Meditation Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
                <span>Play Meditation Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4 border-t border-white/10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 font-medium ${isMeditationAudioPlaying ? 'text-emerald-400' : 'text-amber-400'}`}>
            <Volume2 className={`w-4 h-4 ${isMeditationAudioPlaying ? 'animate-pulse' : ''}`} />
            <span>{isMeditationAudioPlaying ? 'Sacred Audio Playing' : 'Audio Paused'}</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={stopMeditation}
          className="text-slate-400 hover:text-white underline transition-colors cursor-pointer"
        >
          Complete Session
        </button>
      </div>
    </div>
  );
};
