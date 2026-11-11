import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Flame, 
  Sun, 
  Music, 
  Sparkles, 
  BarChart2, 
  Pencil, 
  LogOut, 
  LogIn,
  Bell, 
  Palette, 
  Globe, 
  HelpCircle, 
  ChevronRight,
  User,
  ListMusic,
  Download,
  History,
  Heart,
  Clock,
  Volume2,
  Sliders,
  Mail,
  MessageSquare,
  ShieldCheck,
  X
} from 'lucide-react';

export const ProfileView = () => {
  const { 
    songs,
    downloadedTrackIds,
    theme, 
    appThemes,
    setAppTheme,
    toggleTheme, 
    showToast,
    userProfile,
    setShowAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signInWithApple,
    sendWhatsAppOtp,
    verifyWhatsAppOtp,
    pendingOtpPhone,
    setPendingOtpPhone,
    generatedOtpCode,
    updateUserProfile,
    signOutUser
  } = useMusic();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || 'Devotional Seeker');
  const [editDeity, setEditDeity] = useState(userProfile?.topDeity || 'Universal Divine');

  // Inline quick sign-in states
  const [inlineAuthMode, setInlineAuthMode] = useState(null); // null | 'google' | 'email' | 'whatsapp' | 'apple'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [appleEmail, setAppleEmail] = useState('');
  const [appleName, setAppleName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const likedSongsCount = songs.filter((s) => s.liked).length;

  const openEditProfile = () => {
    setEditName(userProfile?.name || 'Devotional Seeker');
    setEditDeity(userProfile?.topDeity || 'Universal Divine');
    setShowEditModal(true);
  };

  const menuItems = [
    { id: 'profile', title: 'My Profile', icon: User, onClick: openEditProfile },
    { id: 'playlists', title: 'My Playlists', icon: ListMusic, badge: '12', onClick: () => showToast('🎵 12 Custom Playlists loaded') },
    { id: 'downloads', title: 'Downloads', icon: Download, badge: downloadedTrackIds.length || '24', onClick: () => showToast('📥 Offline Downloads ready') },
    { id: 'history', title: 'Listening History', icon: History, onClick: () => showToast('📜 Viewing listening history') },
    { id: 'favorites', title: 'Favorites', icon: Heart, badge: likedSongsCount || '48', onClick: () => showToast('❤️ Favorites list open') },
    { id: 'timer', title: 'Sleep Timer', icon: Clock, onClick: () => showToast('⏱️ Sleep Timer set for 30 minutes') },
    { id: 'quality', title: 'Audio Quality', icon: Volume2, detail: 'High (320 kbps)', onClick: () => showToast('🎧 Audio Quality: High 320 kbps (528Hz Solfeggio)') },
  ];

  const handleToggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    showToast(next ? '🔔 Notifications enabled' : '🔕 Notifications disabled');
  };

  const getAuthBadgeText = () => {
    switch (userProfile?.authMethod) {
      case 'google':
        return 'Google Account Verified ✓';
      case 'email':
        return 'Email Account Verified ✓';
      case 'phone':
        return 'WhatsApp Verified ✓';
      case 'apple':
        return 'Apple ID Verified ✓';
      default:
        return 'Guest Mode • 100% Free';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto pb-32 animate-fadeIn">
      {/* ── Title & Header Icons Row ── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading font-black text-2xl md:text-3xl text-white">
          Profile & Analytics
        </h1>

        <div className="flex items-center gap-2">
          <button 
            onClick={openEditProfile}
            className="p-2 rounded-full hover:bg-white/10 text-amber-400 transition-colors cursor-pointer"
            title="Edit Profile"
          >
            <Pencil className="w-5 h-5" />
          </button>
          {userProfile?.isLoggedIn ? (
            <button 
              onClick={signOutUser}
              className="p-2 rounded-full hover:bg-white/10 text-rose-500 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* ── User Profile Banner Card ── */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-18 h-18 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 shadow-xl shadow-amber-500/30 flex items-center justify-center">
              <img 
                src={userProfile?.avatarUrl || '/logo.png'} 
                alt={userProfile?.name || 'Devotional Seeker'} 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-lg md:text-xl text-white truncate">
                {userProfile?.name || 'Devotional Seeker'}
              </h2>
              <span className="p-1 rounded-full bg-purple-600 text-[10px] text-white flex-shrink-0">
                🕉️
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {userProfile?.email || userProfile?.phone || 'Guest Seeker'}
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold">
                {getAuthBadgeText()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{userProfile?.isLoggedIn ? 'Switch Account' : 'Sign In Options'}</span>
          </button>
        </div>
      </div>

      {/* ── Sign-In Options Section (Always accessible for Guest or Account Sync) ── */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/25 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-extrabold text-base md:text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Sign In & Sync Options</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect your account to save your devotional streak, playlists, and chanting progress (100% Free Forever)
            </p>
          </div>
          {inlineAuthMode && (
            <button
              onClick={() => setInlineAuthMode(null)}
              className="text-xs font-bold text-amber-400 hover:underline self-start sm:self-center cursor-pointer"
            >
              Close Form ✕
            </button>
          )}
        </div>

        {/* Sign-In Option Dropdown Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={inlineAuthMode || ''}
            onChange={(e) => setInlineAuthMode(e.target.value || null)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-amber-400/40 text-white font-bold text-xs outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-300">
              Select a Sign-In & Sync Method...
            </option>
            <option value="google" className="bg-slate-900 text-white">
              🔴 Google — Sign in with Google Account
            </option>
            <option value="email" className="bg-slate-900 text-white">
              ✉️ Email — Sign in with Email & Password
            </option>
            <option value="whatsapp" className="bg-slate-900 text-white">
              💬 WhatsApp OTP — Instant 6-Digit Verification
            </option>
            <option value="apple" className="bg-slate-900 text-white">
               Apple ID — Sign in with Apple
            </option>
          </select>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shrink-0"
          >
            Open Full Sign-In Modal
          </button>
        </div>

        {/* Inline Expandable Form for Selected Sign-In Option */}
        {inlineAuthMode === 'google' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-red-500/30 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-red-300 uppercase tracking-wider">
              Sync Your Google Account
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-red-400"
              />
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-red-400"
              />
            </div>
            <button
              onClick={() => {
                signInWithGoogle({
                  email: googleEmail || 'devotee@gmail.com',
                  name: googleName
                });
                setInlineAuthMode(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs cursor-pointer transition-all"
            >
              Confirm & Sync Google Account
            </button>
          </div>
        )}

        {inlineAuthMode === 'email' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-blue-500/30 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider">
              Sign In with Email & Password
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-blue-400"
              />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => {
                if (signInWithEmail(emailInput, passwordInput)) {
                  setInlineAuthMode(null);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs cursor-pointer transition-all"
            >
              Sign In with Email
            </button>
          </div>
        )}

        {inlineAuthMode === 'whatsapp' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/30 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
              Sign In via WhatsApp / Phone OTP
            </h4>
            {!pendingOtpPhone ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center rounded-xl bg-white/10 border border-white/15 overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-transparent text-amber-300 font-extrabold text-xs px-3 py-2.5 border-r border-white/15 outline-none cursor-pointer"
                  >
                    <option value="+91" className="bg-slate-900 text-white">🇮🇳 +91</option>
                    <option value="+1" className="bg-slate-900 text-white">🇺🇸 +1</option>
                    <option value="+44" className="bg-slate-900 text-white">🇬🇧 +44</option>
                    <option value="+971" className="bg-slate-900 text-white">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter phone / WhatsApp number"
                    className="flex-1 bg-transparent px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-400 outline-none"
                  />
                </div>
                <button
                  onClick={() => sendWhatsAppOtp(`${countryCode}${phoneInput}`)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer transition-all shrink-0"
                >
                  Send WhatsApp OTP
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>
                    OTP sent to <strong className="text-white">{pendingOtpPhone}</strong>
                    {generatedOtpCode && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        Code: {generatedOtpCode}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setPendingOtpPhone('')}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-sm tracking-widest outline-none"
                  />
                  <button
                    onClick={() => {
                      if (verifyWhatsAppOtp(otpInput || generatedOtpCode)) {
                        setInlineAuthMode(null);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition-all"
                  >
                    Verify & Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {inlineAuthMode === 'apple' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-white/20 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Sign In with Apple ID
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={appleEmail}
                onChange={(e) => setAppleEmail(e.target.value)}
                placeholder="yourname@icloud.com"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-white"
              />
              <input
                type="text"
                value={appleName}
                onChange={(e) => setAppleName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-white"
              />
            </div>
            <button
              onClick={() => {
                signInWithApple({
                  email: appleEmail || 'seeker@icloud.com',
                  name: appleName || 'Apple Devotee'
                });
                setInlineAuthMode(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-extrabold text-xs cursor-pointer transition-all"
            >
              Continue with Apple ID
            </button>
          </div>
        )}
      </div>

      {/* ── Section Title: Devotional Insights & Analytics ── */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <BarChart2 className="w-4 h-4" />
        </div>
        <h3 className="font-heading font-extrabold text-lg text-white">
          Devotional Insights & Analytics
        </h3>
      </div>

      {/* ── 2x2 Analytics Grid Cards ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Metric 1: Devotional Streak */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 truncate">Devotional Streak</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 font-heading">
            {userProfile?.streakDays ?? 3} Days
          </div>
          <p className="text-[10px] text-slate-400 truncate">Active daily chanting</p>
        </div>

        {/* Metric 2: Meditation Time */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 truncate">Meditation Time</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 font-heading">
            {userProfile?.meditationMinutes ?? 30} Mins
          </div>
          <p className="text-[10px] text-slate-400 truncate">Noon 12:00 PM engine</p>
        </div>

        {/* Metric 3: Listen Hours */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 truncate">Listen Hours</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 font-heading">
            {userProfile?.totalListenHours ?? 4.5} Hrs
          </div>
          <p className="text-[10px] text-slate-400 truncate">{userProfile?.totalSongsPlayed ?? 25} tracks played</p>
        </div>

        {/* Metric 4: Top Deity */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 truncate">Top Deity</span>
          </div>
          <div className="text-base md:text-lg font-black text-amber-400 font-heading truncate">
            {userProfile?.topDeity || 'Universal Divine'}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Most listened chants</p>
        </div>
      </div>

      {/* ── App Theme Color Schemes Dropdown Card ── */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/25 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading font-extrabold text-base md:text-lg text-white truncate">
              App Theme Color Schemes
            </h3>
            <p className="text-xs text-slate-400 truncate">
              Choose a sacred visual aura from the dropdown
            </p>
          </div>
        </div>

        <select
          value={theme}
          onChange={(e) => setAppTheme(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-amber-400/40 text-white font-bold text-xs outline-none focus:border-amber-400 cursor-pointer"
        >
          {(appThemes || []).map((t) => (
            <option key={t.id} value={t.id} className="bg-slate-900 text-white">
              {t.emoji} {t.name} — {t.subtitle}
            </option>
          ))}
        </select>
      </div>

      {/* ── Section Title: Menu & Settings ── */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sliders className="w-4 h-4" />
        </div>
        <h3 className="font-heading font-extrabold text-lg text-white">
          Menu & Settings
        </h3>
      </div>

      {/* ── Full Default Menu List ── */}
      <div className="glass-panel rounded-3xl border border-amber-500/15 overflow-hidden divide-y divide-white/5 shadow-xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" />
                <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {item.badge && (
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    {item.badge}
                  </span>
                )}
                {item.detail && (
                  <span className="text-xs text-slate-400 font-medium">
                    {item.detail}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}

        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">Notifications</span>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
              notificationsEnabled ? 'bg-amber-400 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">App Theme (Cycle Scheme)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{(appThemes || []).find((t) => t.id === theme)?.name || 'Divine Light'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => showToast('🌐 App Language set to English')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">Language</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>English</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => showToast('💬 Opening Shambala Help & Support')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {userProfile?.isLoggedIn ? (
          <button
            onClick={signOutUser}
            className="w-full p-4 flex items-center gap-3 hover:bg-rose-500/10 transition-all text-left cursor-pointer text-rose-500 font-bold text-sm group"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full p-4 flex items-center gap-3 hover:bg-amber-500/10 transition-all text-left cursor-pointer text-amber-400 font-bold text-sm group"
          >
            <LogIn className="w-5 h-5 text-amber-400" />
            <span>Sign In / Connect Account</span>
          </button>
        )}
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#181335] border border-amber-400/40 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-amber-300">
                Edit Profile Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Devotional Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Top Favorite Deity / Chant Focus</label>
                <input
                  type="text"
                  value={editDeity}
                  onChange={(e) => setEditDeity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>
              <button
                onClick={() => {
                  updateUserProfile({ name: editName, topDeity: editDeity });
                  setShowEditModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
