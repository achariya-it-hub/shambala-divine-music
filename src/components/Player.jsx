import React from 'react';
import { useMusic } from '../context/MusicContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  FileText,
  Activity,
  ListMusic,
  Download,
  Check
} from 'lucide-react';

// Local time formatter
const fmt = (secs) => {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' + s : s}`;
};

export const Player = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    repeatMode,
    setRepeatMode,
    isShuffle,
    setIsShuffle,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    showLyrics,
    setShowLyrics,
    showVisualizer,
    setShowVisualizer,
    showQueue,
    setShowQueue,
    downloadTrack,
    downloadedTrackIds,
    removeDownloadedTrack,
  } = useMusic();

  if (!currentTrack) return null;

  const isDownloaded = downloadedTrackIds?.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    const modes = ['off', 'all', 'track'];
    setRepeatMode(modes[(modes.indexOf(repeatMode) + 1) % modes.length]);
  };

  return (
    <div className="player-area glass-panel border-t border-amber-500/30 px-4 md:px-8 py-3 flex flex-col justify-center">

      {/* ── Progress Scrubber ── */}
      <div className="w-full mb-2 flex items-center gap-3">
        <span className="text-[11px] font-mono font-bold text-slate-400 min-w-[38px] text-right">
          {fmt(currentTime)}
        </span>

        <div className="relative flex-1 flex items-center group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full z-10 opacity-0 cursor-pointer h-4 absolute inset-0"
          />
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-slate-400 min-w-[38px]">
          {fmt(duration)}
        </span>
      </div>

      {/* ── Controls Row ── */}
      <div className="flex items-center justify-between gap-4">

        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 shadow-md">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs md:text-sm font-bold text-white truncate hover:text-amber-400 transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => isDownloaded
              ? removeDownloadedTrack(currentTrack.id)
              : downloadTrack(currentTrack)}
            className={`p-1.5 rounded-full transition-all shrink-0 hidden sm:block ${
              isDownloaded
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-amber-400'
            }`}
            title={isDownloaded ? 'Saved Offline' : 'Download'}
          >
            {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Playback Controls */}
        <div className="flex items-center gap-3 sm:gap-5 justify-center flex-1">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-all ${
              isShuffle
                ? 'text-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrevTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="btn-play-crimson hover:scale-105 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause className="w-5 h-5 fill-white text-white" />
              : <Play  className="w-5 h-5 fill-white text-white ml-0.5" />}
          </button>

          <button
            onClick={handleNextTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-2 rounded-full transition-all ${
              repeatMode !== 'off'
                ? 'text-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'track'
              ? <Repeat1 className="w-4 h-4" />
              : <Repeat  className="w-4 h-4" />}
          </button>
        </div>

        {/* Right — Drawers + Volume */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end w-1/4">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-xl transition-all ${
              showLyrics
                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Lyrics"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`p-2 rounded-xl transition-all ${
              showVisualizer
                ? 'text-purple-400 bg-purple-500/20 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Visualizer"
          >
            <Activity className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-xl transition-all ${
              showQueue
                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Slider */}
          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0
                ? <VolumeX className="w-4 h-4 text-rose-400" />
                : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
