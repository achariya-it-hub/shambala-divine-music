import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Player } from './components/Player';
import { MobileNav } from './components/MobileNav';
import { Visualizer } from './components/Visualizer';
import { LyricsDrawer } from './components/LyricsDrawer';
import { QueueDrawer } from './components/QueueDrawer';
import { MeditationModal } from './components/MeditationModal';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { PodcastView } from './views/PodcastView';
import { LiveStreamView } from './views/LiveStreamView';
import { ProfileView } from './views/ProfileView';
import { OfflineManager } from './components/OfflineManager';
import { AdminPanel } from './components/AdminPanel';

import { Bell } from 'lucide-react';

const AppContent = () => {
  const { currentView, toastMessage } = useMusic();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'podcasts':
        return <PodcastView />;
      case 'live':
        return <LiveStreamView />;
      case 'offline':
        return <OfflineManager />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Top Header */}
      <Header />

      {/* Main Scrollable View Area */}
      <main className="main-area overflow-y-auto relative">
        {renderView()}
      </main>

      {/* Spotify Bottom Player Bar & Mini Player */}
      <Player />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Overlays, Drawers & Modals */}
      <Visualizer />
      <LyricsDrawer />
      <QueueDrawer />
      <MeditationModal />
      <AuthModal />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notification fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 bg-[#0c0a18]/95 border border-amber-400/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slideUp text-xs font-semibold max-w-[90vw]">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}

export default App;
