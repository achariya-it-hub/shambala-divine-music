import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { Search, Wifi, WifiOff, Clock, ShieldCheck, Sun, Moon, User, LogIn, Palette, Sparkles } from 'lucide-react';

export const Header = () => {
  const { 
    activeSearch, 
    setActiveSearch, 
    isOfflineMode, 
    setIsOfflineMode, 
    currentView, 
    setCurrentView,
    showToast,
    theme,
    appThemes,
    setAppTheme,
    toggleTheme,
    isAdminAuthenticated,
    userProfile,
    setShowAuthModal,
    triggerMeditationSimulation
  } = useMusic();

  const [timeStr, setTimeStr] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleOffline = () => {
    const next = !isOfflineMode;
    setIsOfflineMode(next);
    showToast(next ? '📶 Switched to Offline Downloaded Mode' : '🌐 Switched to Online Cloud Mode');
  };

  const currentThemeObj = (appThemes || []).find((t) => t.id === theme) || { name: 'Divine Light', emoji: '☀️' };

  return (
    <header className="header-area px-6 md:px-8 flex items-center justify-between gap-4 z-30 relative">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={activeSearch}
          onChange={(e) => setActiveSearch(e.target.value)}
          placeholder="Search divine songs, mantras, podcasts..."
          className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 text-white placeholder-slate-400 text-xs md:text-sm font-medium rounded-full pl-11 pr-4 py-2.5 border border-amber-500/30 outline-none focus:border-amber-400 transition-all shadow-sm"
        />
      </div>

      {/* Action Badges & Buttons */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Interactive Real-Time Clock & 12:00 PM Meditation Trigger */}
        <button
          onClick={() => triggerMeditationSimulation(new Date().getDay() === 0 ? 7 : new Date().getDay())}
          title="Click to launch 6-Minute 12:00 PM Noon Meditation"
          className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 hover:from-amber-500/25 hover:to-rose-500/20 border border-amber-500/35 text-xs shadow-sm transition-all cursor-pointer group"
        >
          <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="font-mono font-extrabold text-white tracking-wide">{timeStr}</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400 font-extrabold flex items-center gap-1 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
            <span>12:00 PM Meditation</span>
          </span>
        </button>

        {/* ── Interactive Color Theme Swatch Picker ── */}
        <div className="relative">
          <button
            id="theme-toggle-btn"
            onClick={() => setShowThemePicker((prev) => !prev)}
            title="Choose App Color Theme"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-xs font-extrabold text-white transition-all cursor-pointer shadow-sm"
          >
            <span>{currentThemeObj.emoji}</span>
            <span className="hidden md:inline">{currentThemeObj.name}</span>
            <Palette className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-amber-500/40 shadow-2xl p-3 z-50 space-y-1.5 animate-fadeIn">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 px-2 py-1 flex items-center justify-between">
                <span>Sacred Color Themes</span>
                <button onClick={() => setShowThemePicker(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              {(appThemes || []).map((t) => {
                const isSelected = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setAppTheme(t.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                        : 'hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base">{t.emoji}</span>
                      <div className="truncate">
                        <div className={`font-extrabold leading-tight ${isSelected ? 'text-slate-950' : 'text-white'}`}>{t.name}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>{t.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {(t.colors || []).map((hex, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Offline Mode Switcher */}
        <button
          onClick={toggleOffline}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold border transition-all cursor-pointer shadow-sm ${
            isOfflineMode
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-amber-500/20'
              : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-emerald-600/20'
          }`}
        >
          {isOfflineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Mode</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Online Mode</span>
            </>
          )}
        </button>

        {/* Sign In / User Status Button */}
        {!userProfile?.isLoggedIn ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white border border-rose-400/40 transition-all cursor-pointer shadow-md shadow-rose-500/20 flex-shrink-0"
            title="Sign in with Google, Email, Apple ID or WhatsApp OTP"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('profile')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/10 hover:bg-white/15 text-white border border-amber-500/40 transition-all cursor-pointer flex-shrink-0"
            title="View Profile & Account"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="max-w-[110px] truncate">{userProfile.name}</span>
          </button>
        )}

        {/* Profile & Themes Settings Button */}
        <button
          onClick={() => setCurrentView('profile')}
          title="Profile & Color Themes"
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-sm flex-shrink-0 ${
            currentView === 'profile'
              ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-white/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <User className="w-4 h-4" />
        </button>

        {/* Admin Studio Button (Only visible if authenticated or currently on admin view) */}
        {(isAdminAuthenticated || currentView === 'admin') && (
          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 border-amber-500'
                : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-md'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentView === 'admin' ? 'Exit Admin' : 'Admin Panel'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
