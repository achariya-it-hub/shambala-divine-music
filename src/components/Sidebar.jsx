import React from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Home, 
  Radio, 
  Podcast, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Music2, 
  Flame,
  Lock,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    currentView, 
    setCurrentView, 
    downloadedTrackIds, 
    triggerMeditationSimulation,
    isOfflineMode,
    isAdminAuthenticated 
  } = useMusic();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'podcasts', label: 'Podcasts', icon: Podcast },
    { id: 'live', label: 'Live Satsang', icon: Radio, badge: 'LIVE', badgeColor: 'bg-rose-500' },
    { 
      id: 'offline', 
      label: 'Downloads', 
      icon: Download, 
      badge: downloadedTrackIds.length > 0 ? downloadedTrackIds.length : null,
      badgeColor: 'bg-amber-500' 
    },
    { id: 'profile', label: 'Profile', icon: User },
    ...(isAdminAuthenticated ? [{ id: 'admin', label: 'Admin Studio', icon: ShieldCheck }] : [])
  ];

  return (
    <aside className="sidebar-area flex flex-col justify-between p-5 z-20 select-none">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div 
          className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
          onClick={() => setCurrentView('home')}
        >
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-amber-400/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <img src="/logo.png" alt="Happy Shambala Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-heading font-black text-base leading-tight text-white tracking-wider group-hover:text-amber-400 transition-colors">
              HAPPY SHAMBALA
            </h1>
            <span className="text-[9px] font-extrabold tracking-wider text-amber-400 uppercase block">
              Awakening Avadhanies
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'pill-solar-yellow text-slate-950 shadow-md scale-[1.01]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-amber-500'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Playlists Menu */}
        <div className="px-2 pt-3 border-t border-amber-500/20">
          <h2 className="text-xs font-extrabold text-amber-400 tracking-widest uppercase mb-3 flex items-center gap-2">
            <Music2 className="w-4 h-4 text-amber-400" />
            <span>Divine Playlists</span>
          </h2>
          <div className="flex flex-col gap-2.5 text-xs text-slate-300 font-bold">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-left hover:text-rose-500 hover:translate-x-1 transition-all flex items-center gap-3 py-1 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0" />
              <span>Liked Divine Chants</span>
            </button>
            <button 
              onClick={() => setCurrentView('home')}
              className="text-left hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-3 py-1 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>528Hz Solfeggio Miracles</span>
            </button>
            <button 
              onClick={() => setCurrentView('home')}
              className="text-left hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-3 py-1 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Morning Vedic Mantras</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Session Button */}
      <div className="pt-4 border-t border-amber-500/20 space-y-2">
        <button
          onClick={() => triggerMeditationSimulation(new Date().getDay() === 0 ? 7 : new Date().getDay())}
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white p-3.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left shadow-lg shadow-amber-500/25 hover:scale-[1.02]"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-lg shadow-inner">
            🧘
          </div>
          <div>
            <div className="font-extrabold text-xs text-white leading-tight">12:00 PM Meditation</div>
            <div className="text-[10px] text-white/90 font-semibold mt-0.5">Launch 6-Min Session →</div>
          </div>
        </button>

        {!isAdminAuthenticated && (
          <div className="flex justify-end px-1 pt-1">
            <button
              onClick={() => setCurrentView('admin')}
              className="text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
