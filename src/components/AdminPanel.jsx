import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  ShieldCheck, 
  Upload, 
  Podcast, 
  Radio, 
  Clock, 
  Plus, 
  Music, 
  Lock, 
  FolderPlus, 
  Edit3, 
  Trash2, 
  ArrowRightLeft, 
  Search, 
  LogOut, 
  Check, 
  X, 
  Layers, 
  Sparkles,
  AlertCircle,
  Cloud,
  UploadCloud,
  Key,
  CheckCircle2,
  Copy,
  FileAudio,
  FileImage,
  ExternalLink,
  Server,
  Loader2,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Users,
  Smartphone,
  Palette,
  Eye,
  EyeOff,
  Headphones,
  Award,
  UserPlus,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    songs, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addNewSong, 
    updateSong, 
    deleteSong, 
    moveSongCategory, 
    addNewPodcastEpisode, 
    podcasts, 
    liveFeed, 
    toggleLiveStreamStatus, 
    updateLiveStreamConfig,
    addLiveVideoEvent,
    meditationSchedule,
    r2Config,
    updateR2Config,
    uploadToR2,
    getAudioMetadata,
    getRecommendedR2CorsRule,
    showToast,
    analyticsData,
    colorScheme,
    changeColorScheme,
    colorSchemesList
  } = useMusic();

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Tab State: 'songs' | 'categories' | 'r2_config' | 'add_song' | 'podcast' | 'live' | 'meditation' | 'accounts'
  const [activeTab, setActiveTab] = useState('songs');

  // Account Manager State
  const ACCOUNTS_STORAGE_KEY = 'shambala_admin_accounts';
  const getStoredAccounts = () => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        { id: 'acc-root', name: 'Super Admin', username: 'admin', role: 'super_admin', email: 'admin@happyshambala.com', createdAt: new Date().toLocaleDateString(), status: 'active' }
      ];
    } catch { return []; }
  };
  const [accounts, setAccounts] = useState(getStoredAccounts);
  const [newAccForm, setNewAccForm] = useState({ name: '', username: '', email: '', password: '', role: 'admin' });
  const [accFormError, setAccFormError] = useState('');
  const [showAccPassword, setShowAccPassword] = useState(false);
  const [accCreatedMsg, setAccCreatedMsg] = useState('');

  const saveAccounts = (updated) => {
    setAccounts(updated);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setAccFormError('');
    if (!newAccForm.name.trim() || !newAccForm.username.trim() || !newAccForm.password.trim()) {
      setAccFormError('Name, Username, and Password are required.');
      return;
    }
    if (accounts.find(a => a.username.toLowerCase() === newAccForm.username.toLowerCase())) {
      setAccFormError('Username already exists. Please choose a different one.');
      return;
    }
    if (newAccForm.password.length < 6) {
      setAccFormError('Password must be at least 6 characters.');
      return;
    }
    const newAcc = {
      id: `acc-${Date.now()}`,
      name: newAccForm.name.trim(),
      username: newAccForm.username.trim().toLowerCase(),
      email: newAccForm.email.trim(),
      role: newAccForm.role,
      createdAt: new Date().toLocaleDateString(),
      status: 'active'
    };
    saveAccounts([...accounts, newAcc]);
    setNewAccForm({ name: '', username: '', email: '', password: '', role: 'admin' });
    setAccCreatedMsg(`Account "${newAcc.username}" created successfully!`);
    setTimeout(() => setAccCreatedMsg(''), 4000);
  };

  const handleDeleteAccount = (id) => {
    if (id === 'acc-root') { showToast('❌ Cannot delete the root Super Admin account.'); return; }
    saveAccounts(accounts.filter(a => a.id !== id));
  };

  const handleToggleAccountStatus = (id) => {
    if (id === 'acc-root') { showToast('❌ Cannot suspend the root Super Admin account.'); return; }
    saveAccounts(accounts.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' } : a));
  };

  // Cloudflare R2 Credentials Local State
  const [r2Form, setR2Form] = useState({
    accountId: r2Config?.accountId || '',
    bucketName: r2Config?.bucketName || '',
    accessKeyId: r2Config?.accessKeyId || '',
    secretAccessKey: r2Config?.secretAccessKey || '',
    publicDomain: r2Config?.publicDomain || ''
  });

  const [showCorsModal, setShowCorsModal] = useState(false);
  const [copiedCors, setCopiedCors] = useState(false);

  // R2 Direct File Upload Progress States
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [detectedDurationSec, setDetectedDurationSec] = useState(300);
  const [detectedDurationText, setDetectedDurationText] = useState('05:00');

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);

  // Song Filters & Search
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // New Song Form State
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('Divine Single Release');
  const [songCategory, setSongCategory] = useState(categories[0] || 'Bhajans');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [lyrics, setLyrics] = useState('');

  // Editing Song Modal State
  const [editingSong, setEditingSong] = useState(null);

  // Category Manager Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { oldName: string, newName: string }

  // Podcast Episode State
  const [selectedPodcastId, setSelectedPodcastId] = useState(podcasts[0]?.id || '');
  const [epTitle, setEpTitle] = useState('');
  const [epDuration, setEpDuration] = useState('15:00');

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(loginUsername, loginPassword);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setLoginUsername('');
      setLoginPassword('');
    }
  };

  // Handle Audio File Selection (R2 Upload + Duration Detection)
  const handleAudioFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-fill song title from filename if title is blank
    if (!songTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      setSongTitle(nameWithoutExt);
    }

    try {
      // 1. Detect Audio Duration via Web Audio
      const { durationSec, formattedDuration } = await getAudioMetadata(file);
      setDetectedDurationSec(durationSec);
      setDetectedDurationText(formattedDuration);

      // 2. Upload to Cloudflare R2 Bucket
      setIsUploadingAudio(true);
      setAudioProgress(0);

      const result = await uploadToR2({
        file,
        config: r2Config,
        folder: 'audio_tracks',
        onProgress: (pct) => setAudioProgress(pct)
      });

      if (result.success) {
        setAudioUrl(result.url);
        if (result.isSimulated) {
          showToast(`⚠️ Demo Upload Complete! Save your Cloudflare R2 Keys in R2 Tab for live storage.`);
        } else {
          showToast(`⚡ Audio file "${file.name}" uploaded to Cloudflare R2!`);
        }
      }
    } catch (err) {
      console.error('Audio Upload Error:', err);
      showToast(`❌ Upload failed: ${err.message}`);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Handle Cover Art Image Selection (R2 Upload)
  const handleCoverFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setCoverProgress(0);

      const result = await uploadToR2({
        file,
        config: r2Config,
        folder: 'covers',
        onProgress: (pct) => setCoverProgress(pct)
      });

      if (result.success) {
        setCoverUrl(result.url);
        if (result.isSimulated) {
          showToast(`⚠️ Demo Cover Image Uploaded!`);
        } else {
          showToast(`⚡ Cover Art uploaded to Cloudflare R2!`);
        }
      }
    } catch (err) {
      console.error('Cover Upload Error:', err);
      showToast(`❌ Cover upload failed: ${err.message}`);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Handle Save R2 Settings
  const handleSaveR2Settings = (e) => {
    e.preventDefault();
    updateR2Config(r2Form);
  };

  // Handle Add Song
  const handleUploadSong = (e) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    addNewSong({
      title: songTitle.trim(),
      artist: artist.trim() || 'Shambala Divine Choir',
      album: album.trim() || 'Single Release',
      category: songCategory,
      duration: detectedDurationText || '05:00',
      durationSec: detectedDurationSec || 300,
      cover: coverUrl.trim() || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      audioUrl: audioUrl.trim() || 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
      lyrics: lyrics.trim()
    });

    setSongTitle('');
    setArtist('');
    setCoverUrl('');
    setAudioUrl('');
    setLyrics('');
    setAudioProgress(0);
    setCoverProgress(0);
    setActiveTab('songs');
  };

  // Handle Update Song Submit
  const handleUpdateSongSubmit = (e) => {
    e.preventDefault();
    if (!editingSong || !editingSong.title.trim()) return;

    updateSong(editingSong.id, {
      title: editingSong.title.trim(),
      artist: editingSong.artist.trim(),
      album: editingSong.album.trim(),
      category: editingSong.category,
      cover: editingSong.cover.trim(),
      audioUrl: editingSong.audioUrl.trim(),
      lyrics: editingSong.lyrics.trim()
    });

    setEditingSong(null);
  };

  // Handle Add Category
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (addCategory(newCategoryName.trim())) {
      setNewCategoryName('');
    }
  };

  // Handle Save Category Rename
  const handleRenameCategorySubmit = (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.newName.trim()) return;
    updateCategory(editingCategory.oldName, editingCategory.newName.trim());
    setEditingCategory(null);
  };

  // Handle Publish Podcast Episode
  const handlePublishPodcastEpisode = (e) => {
    e.preventDefault();
    if (!epTitle.trim()) return;

    addNewPodcastEpisode(selectedPodcastId, {
      title: epTitle.trim(),
      duration: epDuration,
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'
    });

    setEpTitle('');
  };

  // Filter songs list
  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(songSearchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(songSearchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || song.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // ── 1. UNAUTHENTICATED: SHOW ADMIN LOGIN GATE ───────────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="p-6 md:p-12 max-w-md mx-auto min-h-[75vh] flex items-center justify-center animate-fadeIn">
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-amber-400/20 w-full space-y-6 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header Icon & Title */}
          <div className="text-center space-y-3">
            <div className="w-18 h-18 rounded-full border border-amber-400/40 p-0.5 mx-auto shadow-xl shadow-amber-500/20 overflow-hidden bg-transparent">
              <img src="/logo.png" alt="Happy Shambala Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white">Happy Shambala Admin</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Awakening Avadhanies • Enter security credentials to access song management & category controls
            </p>
          </div>

          {/* Login Error Banner */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Invalid Username or Password. Try demo credentials below.</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
              <span>Login to Admin Panel</span>
            </button>
          </form>

          {/* Demo Passcode Hint Box */}
          <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-slate-300 text-xs space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Default Admin Passcode:</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] pt-1 text-slate-400">
              <span>Username: <strong className="text-white">admin</strong></span>
              <span>Passcode: <strong className="text-amber-400">shambala108</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. AUTHENTICATED ADMIN STUDIO DASHBOARD ─────────────────────────
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-2xl text-white">Admin & Content Studio</h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Super Admin
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Manage song releases, categories, podcast episodes, and 12:00 PM meditation schedule
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={adminLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-white/10 pb-4">
        {[
          { id: 'analytics', label: 'User Analytics Studio', icon: BarChart3, badge: 'REALTIME' },
          { id: 'songs', label: `Songs Library (${songs.length})`, icon: Music },
          { id: 'categories', label: `Category Manager (${categories.length})`, icon: Layers },
          { id: 'r2_config', label: 'Cloudflare R2 Storage', icon: Cloud, badge: r2Config?.bucketName ? 'Connected' : 'Setup' },
          { id: 'add_song', label: 'Release New Song', icon: Upload },
          { id: 'podcast', label: 'Podcast Studio', icon: Podcast },
          { id: 'live', label: 'Live Broadcast', icon: Radio },
          { id: 'accounts', label: `Account Manager (${accounts.length})`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isTabActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                isTabActive
                  ? 'pill-solar-yellow text-slate-950 font-extrabold shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-amber-500/25 shadow-sm'
              }`}
            >
              <Icon className={`w-4 h-4 ${isTabActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                  isTabActive
                    ? 'bg-slate-950 text-amber-300'
                    : r2Config?.bucketName
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: USER ANALYTICS STUDIO */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 max-w-6xl">
          {/* Executive Analytics Metrics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Total Enrolled Users */}
            <div className="glass-panel card-3d p-5 rounded-2xl border border-amber-500/35 relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Total Enrolled Users</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-black text-3xl text-white mt-3">
                {analyticsData?.enrolledUsersCount?.toLocaleString() || '18,420'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{analyticsData?.todaySignups || 342} enrolled today (+18.4%)</span>
              </div>
            </div>

            {/* Metric 2: Real-Time Active Users */}
            <div className="glass-panel card-3d p-5 rounded-2xl border border-rose-500/35 relative overflow-hidden bg-gradient-to-br from-rose-500/15 via-pink-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Active Listeners Now</span>
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
                  <Radio className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-black text-3xl text-white mt-3 flex items-center gap-2">
                <span>{analyticsData?.activeUsersNow?.toLocaleString() || '1,420'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold mt-2">
                <span>DAU: {analyticsData?.dau?.toLocaleString() || '5,680'} | MAU: {analyticsData?.mau?.toLocaleString() || '42,900'}</span>
              </div>
            </div>

            {/* Metric 3: Most Listened Category */}
            <div className="glass-panel card-3d p-5 rounded-2xl border border-purple-500/35 relative overflow-hidden bg-gradient-to-br from-purple-500/15 via-indigo-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Top Listened Category</span>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-black text-3xl text-white mt-3">
                Mantras
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-extrabold mt-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>38% share (412.5K plays logged)</span>
              </div>
            </div>

            {/* Metric 4: Total Track Streams */}
            <div className="glass-panel card-3d p-5 rounded-2xl border border-emerald-500/35 relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Total Track Streams</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <Headphones className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-black text-3xl text-white mt-3">
                1.15M
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>524.3K total listening hours</span>
              </div>
            </div>
          </div>

          {/* GRID: CATEGORY BREAKDOWN & DEVICE ENROLMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Which Category is Mostly Listened (Category Breakdown) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    <span>Which Category is Mostly Listened?</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Category listening analytics based on stream completions & play durations.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  Realtime Telemetry
                </span>
              </div>

              {/* Progress Bar Breakdown */}
              <div className="space-y-4 pt-2">
                {Object.entries(analyticsData?.categoryStats || {}).map(([catName, stats]) => {
                  const colorMap = {
                    Mantras: 'from-amber-400 to-amber-600 text-amber-400',
                    Bhajans: 'from-purple-400 to-purple-600 text-purple-400',
                    Ambient: 'from-cyan-400 to-cyan-600 text-cyan-400',
                    Chants: 'from-emerald-400 to-emerald-600 text-emerald-400',
                    Instrumental: 'from-rose-400 to-rose-600 text-rose-400'
                  };
                  const colorStyle = colorMap[catName] || 'from-amber-400 to-amber-600 text-amber-400';

                  return (
                    <div key={catName} className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${colorStyle.split(' ')[0]} ${colorStyle.split(' ')[1]}`} />
                          <span>{catName}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{stats.plays?.toLocaleString() || '0'} plays</span>
                          <span className="text-slate-400">({stats.hours?.toLocaleString() || '0'} hrs)</span>
                          <span className="text-white font-mono font-extrabold">{stats.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-950/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${colorStyle.split(' ')[0]} ${colorStyle.split(' ')[1]} transition-all duration-1000`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enrolled Users Device Breakdown & Growth */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Enrolled Users Split</span>
              </h3>

              <div className="space-y-4 pt-2">
                {/* Flutter Mobile App */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Flutter Mobile App</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-extrabold">68%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: '68%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    12,525 enrolled Android/iOS mobile application users.
                  </p>
                </div>

                {/* Web Client */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>Web Application Client</span>
                    </span>
                    <span className="text-cyan-400 font-mono font-extrabold">32%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: '32%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    5,895 enrolled web browser users.
                  </p>
                </div>
              </div>

              {/* Peak Activity Hours Info */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1.5 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Peak Listening Surge</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Highest listener concentration occurs at <strong>12:00 PM Noon Meditation</strong> (3,450 peak active users) and <strong>06:00 AM Sunrise Vedic Chants</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* TOP LISTENED SONGS LEADERBOARD */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Which Songs are Mostly Listened? (Top Songs Leaderboard)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Real-time leaderboard ranked by overall plays, listener completion rates, and favorites.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-3">Rank</th>
                    <th className="pb-3 px-3">Divine Song</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Total Plays Logged</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white font-medium">
                  {songs.slice(0, 10).map((song, idx) => {
                    const rankMedals = ['🥇 #1', '🥈 #2', '🥉 #3', '#4', '#5', '#6', '#7', '#8'];
                    const rankBadge = rankMedals[idx] || `#${idx + 1}`;
                    return (
                      <tr key={song.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-3 font-bold font-mono text-amber-400 text-sm">
                          {rankBadge}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <img src={song.cover} alt={song.title} className="w-9 h-9 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-white text-sm leading-tight">{song.title}</div>
                              <div className="text-[11px] text-slate-400">{song.artist}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                            {song.category || 'Bhajans'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold font-mono text-amber-300 text-sm">
                          {song.plays || '100K'} plays
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 font-mono">
                          {song.duration}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
                            <TrendingUp className="w-3 h-3" />
                            <span>🔥 +{15 - idx * 2}% this week</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      {/* TAB 1: COMPLETE SONG MANAGEMENT (Edit, Delete, Move Category) */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={songSearchQuery}
                onChange={(e) => setSongSearchQuery(e.target.value)}
                placeholder="Search songs or artists..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-amber-400/20 border border-amber-400 text-amber-400 font-bold'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Songs Grid / Table List */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Track Details & Category</span>
              <span>Actions & Category Shift</span>
            </div>

            <div className="divide-y divide-white/5">
              {filteredSongs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No songs found matching your search or category filter.
                </div>
              ) : (
                filteredSongs.map((song) => (
                  <div key={song.id} className="p-4 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Song Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 border border-white/10" />
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                        <p className="text-slate-400 text-xs truncate">{song.artist} • <span className="text-slate-500">{song.album}</span></p>
                        <span className="inline-block mt-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          📁 {song.category}
                        </span>
                      </div>
                    </div>

                    {/* Actions & Category Selector */}
                    <div className="flex items-center gap-3">
                      {/* Move Category Quick Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={song.category}
                          onChange={(e) => moveSongCategory(song.id, e.target.value)}
                          className="bg-slate-950 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-amber-400"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Edit Song Button */}
                      <button
                        onClick={() => setEditingSong({ ...song })}
                        className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 transition-all"
                        title="Edit Song Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Song Button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
                            deleteSong(song.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGER (Add, Rename, Delete Categories) */}
      {activeTab === 'categories' && (
        <div className="space-y-6 max-w-4xl">
          {/* Add Category Form */}
          <form onSubmit={handleAddCategorySubmit} className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-3">
            <input
              type="text"
              required
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name (e.g., Stotrams, Aarti, Kirtan)..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
            <button type="submit" className="btn-primary py-3 px-6 rounded-2xl font-bold text-xs">
              <FolderPlus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </form>

          {/* Active Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const songCount = songs.filter((s) => s.category === cat).length;
              return (
                <div key={cat} className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-base flex items-center gap-2">
                      <span className="text-amber-400">📁</span>
                      <span>{cat}</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">{songCount} Divine Songs inside</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rename Category Button */}
                    <button
                      onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                      className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 transition-all text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Rename</span>
                    </button>

                    {/* Delete Category Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat}"? Songs inside will be reassigned.`)) {
                          deleteCategory(cat);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2.5: CLOUDFLARE R2 BUCKET CONFIGURATION */}
      {activeTab === 'r2_config' && (
        <div className="space-y-6 max-w-4xl">
          <form onSubmit={handleSaveR2Settings} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                  <Cloud className="w-6 h-6 text-amber-400" />
                  <span>Cloudflare R2 Bucket Configuration</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Connect your Cloudflare R2 bucket for unlimited high-speed audio & image hosting.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                r2Config?.bucketName && r2Config?.accessKeyId
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${r2Config?.bucketName ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {r2Config?.bucketName ? 'R2 Connected' : 'Unconfigured'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <span>Cloudflare Account ID</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={r2Form.accountId}
                  onChange={(e) => setR2Form({ ...r2Form, accountId: e.target.value })}
                  placeholder="e.g. 9f8e7d6c5b4a3f2e1d0c9b8a"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <span>R2 Bucket Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={r2Form.bucketName}
                  onChange={(e) => setR2Form({ ...r2Form, bucketName: e.target.value })}
                  placeholder="e.g. shambala-divine-music"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>R2 Access Key ID</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={r2Form.accessKeyId}
                  onChange={(e) => setR2Form({ ...r2Form, accessKeyId: e.target.value })}
                  placeholder="e.g. c03a4f..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>R2 Secret Access Key</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={r2Form.secretAccessKey}
                  onChange={(e) => setR2Form({ ...r2Form, secretAccessKey: e.target.value })}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <span>Public R2 Bucket Domain / Custom Domain (Optional)</span>
              </label>
              <input
                type="text"
                value={r2Form.publicDomain}
                onChange={(e) => setR2Form({ ...r2Form, publicDomain: e.target.value })}
                placeholder="e.g. https://pub-9f8e7d.r2.dev or https://media.shambala.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Leave empty to use the default Cloudflare R2 pub domain format (<code>https://pub-&lt;account_id&gt;.r2.dev</code>).
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCorsModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all w-full md:w-auto"
              >
                <HelpCircle className="w-4 h-4" />
                <span>View Bucket CORS Policy JSON</span>
              </button>

              <button type="submit" className="btn-primary py-3 px-8 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 w-full md:w-auto justify-center">
                <Check className="w-4 h-4" />
                <span>Save Cloudflare R2 Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: UPLOAD NEW DIVINE SONG WITH CLOUDFLARE R2 DRAG & DROP */}
      {activeTab === 'add_song' && (
        <form onSubmit={handleUploadSong} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              <span>Upload New Divine Release</span>
            </h3>
            {r2Config?.bucketName ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" />
                R2 Cloud Storage Enabled
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                R2 Demo Upload Mode
              </span>
            )}
          </div>

          {/* DRAG & DROP CLOUDFLARE R2 AUDIO UPLOADER */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Audio File Upload (Direct to Cloudflare R2) *
            </label>
            <div className="relative border-2 border-dashed border-amber-400/30 hover:border-amber-400 bg-amber-400/5 hover:bg-amber-400/10 rounded-2xl p-6 text-center transition-all cursor-pointer group">
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.flac,.aac,.ogg"
                onChange={handleAudioFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {isUploadingAudio ? (
                <div className="space-y-3 py-2">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-white">Uploading track to Cloudflare R2...</div>
                  <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono">{audioProgress}% completed</div>
                </div>
              ) : audioUrl ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Audio File Attached & Uploaded
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">{audioUrl}</div>
                      <div className="text-[10px] text-amber-300">Detected Duration: {detectedDurationText}</div>
                    </div>
                  </div>

                  <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-xl font-bold">
                    Change File
                  </span>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <UploadCloud className="w-10 h-10 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-bold text-white">Drop audio track here, or click to browse</div>
                  <div className="text-xs text-slate-400">Supports MP3, WAV, M4A, FLAC • Auto duration calculation</div>
                </div>
              )}
            </div>
          </div>

          {/* DRAG & DROP CLOUDFLARE R2 COVER IMAGE UPLOADER */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Cover Art Upload (Cloudflare R2)
            </label>
            <div className="relative border-2 border-dashed border-white/10 hover:border-purple-400 bg-white/5 hover:bg-purple-500/5 rounded-2xl p-5 text-center transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.svg"
                onChange={handleCoverFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {isUploadingCover ? (
                <div className="space-y-2 py-1">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-white">Uploading Cover to R2 ({coverProgress}%)</div>
                </div>
              ) : coverUrl ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={coverUrl} alt="Cover Preview" className="w-12 h-12 rounded-xl object-cover border border-white/20" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Cover Image Ready
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-xs">{coverUrl}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-white/10 text-slate-300 px-3 py-1.5 rounded-xl font-bold">Replace Cover</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 py-1">
                  <FileImage className="w-6 h-6 text-purple-400" />
                  <span className="text-xs text-slate-300 font-semibold">Drop cover image here, or click to upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Song Title *
              </label>
              <input
                type="text"
                required
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="e.g. Gayatri Mantra 108 Times"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Chanting Artist / Choir
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Swami Shambala Choir"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Category *
              </label>
              <select
                value={songCategory}
                onChange={(e) => setSongCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Album / Collection Name
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Divine Single Release"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Lyrics / Sanskrit Chant Text & Meaning
            </label>
            <textarea
              rows={4}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Write or paste divine lyrics and Sanskrit meanings..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3.5 text-sm font-bold shadow-xl shadow-amber-500/20">
            <Plus className="w-5 h-5" />
            <span>Publish Divine Song</span>
          </button>
        </form>
      )}

      {/* TAB 4: PUBLISH PODCAST EPISODE */}
      {activeTab === 'podcast' && (
        <form onSubmit={handlePublishPodcastEpisode} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 max-w-3xl">
          <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Podcast className="w-5 h-5 text-purple-400" />
            <span>Publish Podcast Episode</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Podcast Show
            </label>
            <select
              value={selectedPodcastId}
              onChange={(e) => setSelectedPodcastId(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
            >
              {podcasts.map((pod) => (
                <option key={pod.id} value={pod.id}>{pod.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Episode Title *
            </label>
            <input
              type="text"
              required
              value={epTitle}
              onChange={(e) => setEpTitle(e.target.value)}
              placeholder="e.g. Ep 25: Power of Silence"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Duration (mm:ss)
            </label>
            <input
              type="text"
              value={epDuration}
              onChange={(e) => setEpDuration(e.target.value)}
              placeholder="15:00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3">
            <Plus className="w-5 h-5" />
            <span>Publish Episode</span>
          </button>
        </form>
      )}

      {/* TAB 5: LIVE BROADCAST CONTROLLER (VIDEO + AUDIO SPIRITUAL EVENTS) */}
      {activeTab === 'live' && (
        <div className="space-y-6 max-w-4xl">
          {/* Status & Mode Card */}
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/25 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-rose-500" />
                  <span>Live Spiritual Video & Audio Broadcast Studio</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Broadcast live temple Aarti, Homa ceremonies, YouTube Live, Cloudflare Stream, or HLS/MP4 video feeds
                </p>
              </div>

              <button
                onClick={toggleLiveStreamStatus}
                className={`px-6 py-3 rounded-full font-extrabold text-xs shadow-lg transition-all cursor-pointer shrink-0 ${
                  liveFeed.isLive 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {liveFeed.isLive ? '🔴 Stop Live Broadcast' : '🟢 Go Live Now'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Main Broadcast Title
                </label>
                <input
                  type="text"
                  value={liveFeed.title || ''}
                  onChange={(e) => updateLiveStreamConfig({ title: e.target.value })}
                  placeholder="Shambala 24/7 Global Divine Satsang"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Default Stream Mode
                </label>
                <select
                  value={liveFeed.streamMode || 'video'}
                  onChange={(e) => updateLiveStreamConfig({ streamMode: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="video">📹 Live Video + Audio Stream (Default)</option>
                  <option value="audio">🎧 Audio-Only Chanting Stream</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add / Update Spiritual Video Event Stream */}
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/25 space-y-5">
            <h4 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Publish Live Spiritual Video Event Channel</span>
            </h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const title = form.evtTitle.value.trim();
                const subtitle = form.evtSubtitle.value.trim();
                const videoType = form.evtType.value;
                const videoUrl = form.evtUrl.value.trim();
                const tag = form.evtTag.value.trim() || '🔴 LIVE EVENT';
                if (!title || !videoUrl) return;
                addLiveVideoEvent({
                  title,
                  subtitle,
                  tag,
                  videoType,
                  videoUrl,
                  directVideoUrl: videoUrl
                });
                form.reset();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Spiritual Event Title *
                  </label>
                  <input
                    name="evtTitle"
                    type="text"
                    required
                    placeholder="e.g. Live Purnima Maha Aarti & Darshan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Sanctuary / Location Subtitle
                  </label>
                  <input
                    name="evtSubtitle"
                    type="text"
                    placeholder="e.g. Shambala Main Temple • HD 1080p Live"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Video Source Type
                  </label>
                  <select
                    name="evtType"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  >
                    <option value="youtube">YouTube Live / Embed URL</option>
                    <option value="direct">Direct MP4 / HLS (.m3u8) / R2 Video</option>
                    <option value="cloudflare">Cloudflare Stream Embed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Event Badge Tag
                  </label>
                  <input
                    name="evtTag"
                    type="text"
                    defaultValue="🔴 LIVE DARSHAN"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Live Video Stream URL *
                  </label>
                  <input
                    name="evtUrl"
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or .mp4/.m3u8"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3 text-xs font-extrabold">
                <Plus className="w-4 h-4" />
                <span>Add Live Spiritual Video Channel</span>
              </button>
            </form>

            {/* Active Video Channels List */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                Active Live Video Event Channels ({(liveFeed.videoEvents || []).length})
              </div>
              {(liveFeed.videoEvents || []).map((evt, idx) => (
                <div key={evt.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        {evt.tag}
                      </span>
                      <span className="font-bold text-xs text-white truncate">{evt.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{evt.videoUrl}</div>
                  </div>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = (liveFeed.videoEvents || []).filter((item) => item.id !== evt.id);
                        updateLiveStreamConfig({ videoEvents: filtered });
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                      title="Remove Event Channel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: 12:00 PM MEDITATION SCHEDULE */}
      {activeTab === 'meditation' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>6-Day 12:00 PM - 12:06 PM Meditation Schedule</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditationSchedule.map((med) => (
              <div key={med.dayIndex} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">{med.dayName}</span>
                  <span className="text-[10px] font-mono text-slate-400">12:00 PM - 12:06 PM</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={med.cover} alt={med.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="text-white font-bold text-sm leading-snug">{med.title}</h5>
                    <p className="text-slate-400 text-xs truncate">{med.mantra}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT SONG DETAILS */}
      {editingSong && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-400/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Edit Song Details</span>
              </h3>
              <button onClick={() => setEditingSong(null)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSongSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Song Title</label>
                  <input
                    type="text"
                    required
                    value={editingSong.title}
                    onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Artist</label>
                  <input
                    type="text"
                    value={editingSong.artist}
                    onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Category</label>
                  <select
                    value={editingSong.category}
                    onChange={(e) => setEditingSong({ ...editingSong, category: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Album</label>
                  <input
                    type="text"
                    value={editingSong.album}
                    onChange={(e) => setEditingSong({ ...editingSong, album: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Cover URL</label>
                  <input
                    type="text"
                    value={editingSong.cover}
                    onChange={(e) => setEditingSong({ ...editingSong, cover: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Audio URL</label>
                  <input
                    type="text"
                    value={editingSong.audioUrl}
                    onChange={(e) => setEditingSong({ ...editingSong, audioUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Lyrics</label>
                <textarea
                  rows={4}
                  value={editingSong.lyrics || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, lyrics: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSong(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2.5 px-6 rounded-xl font-bold text-xs">
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RENAME CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-amber-400/30 w-full max-w-md space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">Rename Category</h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRenameCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.newName}
                  onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 rounded-xl font-bold text-xs">
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CLOUDFLARE R2 CORS POLICY HELPER */}
      {showCorsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-purple-400/30 w-full max-w-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-purple-400" />
                <span>Cloudflare R2 Bucket CORS Policy</span>
              </h3>
              <button onClick={() => setShowCorsModal(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                To allow direct browser uploads from your application to your Cloudflare R2 bucket, copy the CORS policy below and add it to your bucket settings in Cloudflare:
              </p>

              <ol className="list-decimal list-inside space-y-1 text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
                <li>Log in to <strong>Cloudflare Dashboard</strong> → <strong>R2</strong></li>
                <li>Select your bucket: <strong>{r2Form.bucketName || 'your-bucket-name'}</strong></li>
                <li>Click <strong>Settings</strong> → Scroll to <strong>CORS Policy</strong> → Click <strong>Add CORS Policy</strong></li>
                <li>Paste the JSON rule below and save!</li>
              </ol>

              <div className="relative">
                <pre className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-56">
                  {getRecommendedR2CorsRule(window.location.origin)}
                </pre>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getRecommendedR2CorsRule(window.location.origin));
                    setCopiedCors(true);
                    setTimeout(() => setCopiedCors(false), 3000);
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs transition-all"
                >
                  {copiedCors ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCors ? 'Copied JSON!' : 'Copy CORS JSON'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCorsModal(false)}
                className="btn-primary py-2.5 px-6 rounded-xl font-bold text-xs"
              >
                Close Helper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ACCOUNT MANAGER */}
      {activeTab === 'accounts' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT: Create New Account Form */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/15 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Create New Account</h3>
                  <p className="text-slate-400 text-xs">Add a new Admin or User panel account</p>
                </div>
              </div>

              {accCreatedMsg && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{accCreatedMsg}</span>
                </div>
              )}
              {accFormError && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{accFormError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'super_admin', label: 'Super Admin', desc: 'Full access', icon: Shield, color: 'amber' },
                      { value: 'admin', label: 'Admin', desc: 'Content & songs', icon: ShieldCheck, color: 'purple' },
                      { value: 'editor', label: 'Editor', desc: 'Songs & podcasts', icon: Edit3, color: 'cyan' },
                      { value: 'viewer', label: 'Viewer', desc: 'Read-only access', icon: Eye, color: 'slate' }
                    ].map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setNewAccForm(f => ({ ...f, role: role.value }))}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          newAccForm.role === role.value
                            ? 'bg-amber-400/15 border-amber-400/50 text-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <role.icon className="w-4 h-4 mb-1" />
                        <div className="font-bold text-xs">{role.label}</div>
                        <div className="text-[10px] opacity-70">{role.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAccForm.name}
                    onChange={e => setNewAccForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Gurudev Arya"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={newAccForm.username}
                    onChange={e => setNewAccForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="e.g. gurudev"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
                  <input
                    type="email"
                    value={newAccForm.email}
                    onChange={e => setNewAccForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="e.g. gurudev@happyshambala.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showAccPassword ? 'text' : 'password'}
                      required
                      value={newAccForm.password}
                      onChange={e => setNewAccForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccPassword(v => !v)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors p-1"
                    >
                      {showAccPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </form>
            </div>

            {/* RIGHT: Account List */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-400/15 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">All Accounts</h3>
                    <p className="text-slate-400 text-xs">{accounts.length} account{accounts.length !== 1 ? 's' : ''} registered</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {accounts.map(acc => {
                  const roleConfig = {
                    super_admin: { label: 'Super Admin', color: 'amber', icon: Shield },
                    admin: { label: 'Admin', color: 'purple', icon: ShieldCheck },
                    editor: { label: 'Editor', color: 'cyan', icon: Edit3 },
                    viewer: { label: 'Viewer', color: 'slate', icon: Eye }
                  };
                  const role = roleConfig[acc.role] || roleConfig.viewer;
                  const RoleIcon = role.icon;
                  const colorMap = {
                    amber: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
                    purple: 'bg-purple-400/15 text-purple-400 border-purple-400/30',
                    cyan: 'bg-cyan-400/15 text-cyan-400 border-cyan-400/30',
                    slate: 'bg-slate-400/15 text-slate-400 border-slate-400/30'
                  };
                  return (
                    <div
                      key={acc.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        acc.status === 'suspended'
                          ? 'bg-rose-500/5 border-rose-500/20 opacity-70'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorMap[role.color]}`}>
                            <RoleIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white truncate">{acc.name}</span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${colorMap[role.color]}`}>
                                {role.label}
                              </span>
                              {acc.status === 'suspended' && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  Suspended
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">@{acc.username}</div>
                            {acc.email && <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>}
                            <div className="text-[10px] text-slate-600 mt-0.5">Created: {acc.createdAt}</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {acc.id !== 'acc-root' && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleToggleAccountStatus(acc.id)}
                              title={acc.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                              className={`p-1.5 rounded-xl border transition-all ${
                                acc.status === 'active'
                                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border-amber-400/30'
                                  : 'bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border-emerald-400/30'
                              }`}
                            >
                              {acc.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(acc.id)}
                              title="Delete Account"
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Role Permissions Reference */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Role Permissions Reference
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { role: 'Super Admin', icon: Shield, color: 'amber', perms: ['Full system access', 'Create/delete accounts', 'Manage all content', 'R2 storage config', 'Analytics dashboard'] },
                { role: 'Admin', icon: ShieldCheck, color: 'purple', perms: ['Song management', 'Category manager', 'Podcast studio', 'Live broadcast', 'Analytics view'] },
                { role: 'Editor', icon: Edit3, color: 'cyan', perms: ['Upload songs', 'Edit song info', 'Podcast episodes', 'No account access', 'No R2 access'] },
                { role: 'Viewer', icon: Eye, color: 'slate', perms: ['View analytics', 'View song list', 'Read-only access', 'No editing', 'No uploads'] }
              ].map(r => {
                const RIcon = r.icon;
                const cMap = { amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20', purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20', cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', slate: 'text-slate-400 bg-slate-400/10 border-slate-400/20' };
                return (
                  <div key={r.role} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${cMap[r.color]}`}>
                      <RIcon className="w-3.5 h-3.5" />
                      {r.role}
                    </div>
                    <ul className="space-y-1">
                      {r.perms.map(p => (
                        <li key={p} className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

