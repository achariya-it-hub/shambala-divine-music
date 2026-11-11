import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Sparkles } from 'lucide-react';

export const Visualizer = () => {
  const { showVisualizer, setShowVisualizer, isPlaying, currentTrack } = useMusic();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!showVisualizer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.45;

      phase += isPlaying ? 0.03 : 0.005;

      // Draw background cosmic aura ring
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.5);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.15)');
      gradient.addColorStop(1, 'rgba(10, 9, 20, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw radial spectrum bars around circle
      const barCount = 72;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        
        // Simulating frequency spectrum amplitude with sine wave combinations
        const amp = isPlaying
          ? Math.abs(Math.sin(angle * 4 + phase) * Math.cos(angle * 2 - phase * 0.5) * 60) + 15
          : 5;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + amp);
        const y2 = centerY + Math.sin(angle) * (radius + amp);

        ctx.strokeStyle = `hsl(${(i * 5 + phase * 20) % 360}, 80%, 65%)`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw glowing central orb
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
      // Read the current theme's bg-player CSS variable for the orb fill
      const orbFill = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-player').trim() || 'rgba(12, 10, 24, 0.9)';
      ctx.fillStyle = orbFill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showVisualizer, isPlaying]);

  if (!showVisualizer) return null;

  return (
    <div className="visualizer-overlay fixed inset-0 z-40 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-fadeIn">
      {/* Top Header */}
      <div className="absolute top-6 right-6 left-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg font-heading">Divine Frequency Spectrum</h3>
            <p className="text-slate-400 text-xs">{currentTrack?.title} • {currentTrack?.artist}</p>
          </div>
        </div>

        <button
          onClick={() => setShowVisualizer(false)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-full max-w-4xl max-h-[600px] relative flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Track Artwork at Center of Radial Spectrum */}
        {currentTrack && (
          <div className="absolute w-36 h-36 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/30 animate-spin-slow">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};
