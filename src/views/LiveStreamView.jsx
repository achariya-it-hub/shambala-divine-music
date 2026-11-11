import React, { useState, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Radio, 
  Video, 
  Headphones, 
  Play, 
  Pause, 
  Users, 
  Send, 
  Heart, 
  Share2, 
  Calendar, 
  Maximize2, 
  PictureInPicture2, 
  Sparkles, 
  Flame, 
  Bell,
  Tv
} from 'lucide-react';

// Convert standard YouTube watch/live URLs to embeddable URLs
const toEmbedUrl = (url = '') => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  }
  return url;
};

export const LiveStreamView = () => {
  const { liveFeed, playTrack, currentTrack, isPlaying, addLiveChatMessage, showToast } = useMusic();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'schedule'
  const [streamMode, setStreamMode] = useState(liveFeed.streamMode || 'video'); // 'video' | 'audio'
  const [selectedEventIdx, setSelectedEventIdx] = useState(liveFeed.activeEventIndex || 0);
  const [chatInput, setChatInput] = useState('');
  const [aartiOfferings, setAartiOfferings] = useState(108);
  const videoContainerRef = useRef(null);
  const htmlVideoRef = useRef(null);

  const videoEvents = liveFeed.videoEvents || [
    {
      id: 'evt-1',
      title: 'Live Maha Aarti & Divine Darshan',
      subtitle: 'Shambala Main Sanctuary • HD 1080p Live Video',
      tag: '🔴 LIVE NOW',
      videoType: 'direct',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42451-large.mp4',
      directVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42451-large.mp4',
      cover: liveFeed.cover,
      viewers: '1.4K watching'
    }
  ];

  const activeEvent = videoEvents[selectedEventIdx] || videoEvents[0];

  const liveTrack = {
    id: liveFeed.id,
    title: activeEvent?.title || liveFeed.title,
    artist: liveFeed.broadcaster,
    album: '24/7 Live Satsang Stream',
    category: 'Live Broadcast',
    duration: 'LIVE',
    durationSec: 99999,
    cover: activeEvent?.cover || liveFeed.cover,
    audioUrl: liveFeed.audioUrl,
    synthType: 'om_528',
    lyrics: '🔴 LIVE BROADCAST: Divine Chanting & Video Darshan Live from Shambala.'
  };

  const isThisPlaying = currentTrack?.id === liveFeed.id && isPlaying;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addLiveChatMessage(chatInput.trim());
    setChatInput('');
  };

  const handleFullscreen = () => {
    if (videoContainerRef.current?.requestFullscreen) {
      videoContainerRef.current.requestFullscreen();
    }
  };

  const handlePiP = async () => {
    try {
      if (htmlVideoRef.current && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await htmlVideoRef.current.requestPictureInPicture();
        }
      } else {
        showToast('📺 Picture-in-Picture is available on direct MP4/HLS streams');
      }
    } catch {
      showToast('📺 Unable to open Picture-in-Picture');
    }
  };

  const handleOfferBlessing = (emoji, label) => {
    setAartiOfferings((prev) => prev + 1);
    addLiveChatMessage(`${emoji} Offered ${label} during Live Darshan`);
    showToast(`${emoji} ${label} offered to the Sanctuary!`);
  };

  const scheduleEvents = [
    { time: '06:00 AM', title: 'Suprabhatam & Morning Kakad Aarti', type: 'HD Video + Audio' },
    { time: '10:00 AM', title: 'Vedic Rudra Abhishekam & Homa Ritual', type: 'Multi-Cam Video' },
    { time: '12:00 PM', title: 'Sharp 6-Min Global Noon Meditation', type: 'Guided Live Video' },
    { time: '04:00 PM', title: '528Hz Solfeggio Sound Healing Concert', type: 'Spatial Audio + Video' },
    { time: '07:00 PM', title: 'Evening Maha Aarti & Gurudev Satsang', type: '4K Live Broadcast' }
  ];

  const isEmbedStream =
    activeEvent?.videoType === 'youtube' ||
    activeEvent?.videoType === 'cloudflare' ||
    (activeEvent?.videoUrl && (activeEvent.videoUrl.includes('youtube.com') || activeEvent.videoUrl.includes('youtu.be') || activeEvent.videoUrl.includes('cloudflarestream.com')));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto pb-32 animate-fadeIn">
      {/* ── Top Header Banner with Video / Audio Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 flex-shrink-0">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl md:text-2xl text-white">
                Live Spiritual Events & Darshan
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow animate-pulse">
                🔴 LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Watch live Temple Aarti, Homa ceremonies, Satsangs & global meditation broadcasts
            </p>
          </div>
        </div>

        {/* Mode Toggle: Live Video vs Audio Only */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 border border-amber-500/30 self-start sm:self-auto">
          <button
            onClick={() => setStreamMode('video')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              streamMode === 'video'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Video</span>
          </button>
          <button
            onClick={() => setStreamMode('audio')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              streamMode === 'audio'
                ? 'pill-solar-yellow text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio Only</span>
          </button>
        </div>
      </div>

      {/* ── Live Spiritual Event Channels Selector Bar ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {videoEvents.map((evt, idx) => {
          const isSelected = idx === selectedEventIdx;
          return (
            <button
              key={evt.id}
              onClick={() => setSelectedEventIdx(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'glass-panel border-rose-500 shadow-lg scale-[1.01]'
                  : 'glass-panel border-amber-500/20 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                <img src={evt.cover} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <Tv className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white mb-1">
                  {evt.tag}
                </span>
                <h4 className="font-bold text-xs text-white truncate">{evt.title}</h4>
                <p className="text-[10px] text-slate-400 truncate">{evt.viewers}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Main Live Video / Audio Stage Card ── */}
      <div className="glass-panel p-5 md:p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-2xl">
        <div
          ref={videoContainerRef}
          className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 bg-black group"
        >
          {streamMode === 'video' ? (
            isEmbedStream && activeEvent?.videoUrl ? (
              <iframe
                src={toEmbedUrl(activeEvent.videoUrl)}
                title={activeEvent.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                ref={htmlVideoRef}
                key={activeEvent?.directVideoUrl || activeEvent?.videoUrl}
                src={activeEvent?.directVideoUrl || activeEvent?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42451-large.mp4'}
                poster={activeEvent?.cover || liveFeed.cover}
                autoPlay
                loop
                muted={false}
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            )
          ) : (
            /* Audio-Only Spiritual Sanctuary Stage */
            <>
              <img
                src={activeEvent?.cover || liveFeed.cover}
                alt={activeEvent?.title || liveFeed.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-between p-4 md:p-6 hero-banner-card">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>AUDIO STREAM LIVE</span>
                  </span>

                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 font-mono text-xs font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{liveFeed.listenerCount || '1.4K'}</span>
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white">
                      {activeEvent?.title || 'Divine Chanting Live'}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      {activeEvent?.subtitle || 'from Shambala Sanctuary'}
                    </p>
                  </div>

                  <button
                    onClick={() => playTrack(liveTrack, [liveTrack])}
                    className="btn-play-crimson hover:scale-105 transition-all shadow-xl cursor-pointer"
                    title={isThisPlaying ? 'Pause Live Stream' : 'Listen Live'}
                  >
                    {isThisPlaying ? <Pause className="w-6 h-6 fill-white text-white" /> : <Play className="w-6 h-6 fill-white text-white ml-0.5" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Interactive Spiritual Offerings & Stream Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base md:text-lg text-white">
                {activeEvent?.title || liveFeed.title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                1080p HD • 528Hz Audio
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeEvent?.subtitle || liveFeed.broadcaster} • {aartiOfferings} Digital Offerings Today
            </p>
          </div>

          {/* Interactive Darshan Offerings & Player Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOfferBlessing('🪔', 'Sacred Diya Lamp')}
              className="px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/35 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Offer a Sacred Diya Lamp"
            >
              <span>🪔 Light Diya</span>
            </button>
            <button
              onClick={() => handleOfferBlessing('🌸', 'Lotus Pushpanjali')}
              className="px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/35 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Offer Lotus Flowers"
            >
              <span>🌸 Offer Flowers</span>
            </button>
            <button
              onClick={() => playTrack(liveTrack, [liveTrack])}
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isThisPlaying ? 'Pause Audio' : 'Background Audio'}</span>
            </button>
            <button
              onClick={handlePiP}
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-amber-500/25 transition-colors cursor-pointer"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-amber-500/25 transition-colors cursor-pointer"
              title="Fullscreen Video"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs: Live Satsang Chat vs Event Schedule ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 rounded-full font-extrabold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'pill-solar-yellow text-slate-950 shadow-md'
              : 'bg-white/10 text-slate-300 border border-amber-500/25 hover:bg-white/15'
          }`}
        >
          💬 Live Satsang Chat ({liveFeed.chatMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-2.5 rounded-full font-extrabold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'pill-solar-yellow text-slate-950 shadow-md'
              : 'bg-white/10 text-slate-300 border border-amber-500/25 hover:bg-white/15'
          }`}
        >
          📅 Spiritual Video Event Schedule
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'chat' ? (
        <div className="glass-panel p-5 rounded-3xl border border-amber-500/25 flex flex-col justify-between h-[420px] shadow-xl">
          {/* Chat Messages */}
          <div className="overflow-y-auto space-y-3.5 pr-2 scrollbar-none flex-1">
            {liveFeed.chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow">
                  {msg.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate">{msg.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Send Chat Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Share your blessings or prayers in live chat..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/25 space-y-4 shadow-xl">
          <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Upcoming Live Video Broadcast Schedule</span>
          </h4>
          <div className="space-y-3">
            {scheduleEvents.map((evt, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/25">
                    {evt.time}
                  </span>
                  <span className="text-xs md:text-sm text-white font-bold">{evt.title}</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  📹 {evt.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamView;
