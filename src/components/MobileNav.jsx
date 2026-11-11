import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Home, Podcast, Radio, Download, ShieldCheck, User } from 'lucide-react';

export const MobileNav = () => {
  const { currentView, setCurrentView, downloadedTrackIds, isAdminAuthenticated } = useMusic();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'podcasts', label: 'Explore', icon: Podcast },
    { id: 'live', label: 'Live', icon: Radio, badge: 'LIVE' },
    { 
      id: 'offline', 
      label: 'Library', 
      icon: Download, 
      badge: downloadedTrackIds.length > 0 ? downloadedTrackIds.length : null 
    },
    { id: 'profile', label: 'Profile', icon: User },
    ...(isAdminAuthenticated || currentView === 'admin' ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck }] : [])
  ];

  return (
    <nav className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-40 px-2 shadow-2xl border-t border-amber-500/20 bg-white/95 backdrop-blur-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
              isActive ? 'text-amber-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-500' : 'text-slate-400'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 text-[9px] font-black px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] tracking-tight mt-1 font-bold ${isActive ? 'text-amber-500' : 'text-slate-400'}`}>
              {item.label}
            </span>

            {/* Golden Active Indicator Line */}
            {isActive && (
              <span className="absolute bottom-0 w-6 h-1 rounded-full bg-amber-400 shadow-sm" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
