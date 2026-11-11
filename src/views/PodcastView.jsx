import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Podcast, Play, Pause, Clock, Calendar, Sparkles } from 'lucide-react';

export const PodcastView = () => {
  const { podcasts, playTrack, currentTrack, isPlaying } = useMusic();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Podcast className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-3xl text-white">Spiritual Podcasts</h2>
          <p className="text-slate-400 text-sm">Listen to Satsangs, scripture discussions, and mindful awakening talks</p>
        </div>
      </div>

      {/* Podcast Shows List */}
      <div className="space-y-8">
        {podcasts.map((pod) => (
          <div key={pod.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            {/* Show Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img 
                src={pod.cover} 
                alt={pod.title} 
                className="w-32 h-32 rounded-2xl object-cover border border-amber-400/30 shadow-xl flex-shrink-0"
              />
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Hosted by {pod.host}</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">{pod.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{pod.description}</p>
                <span className="text-xs text-slate-500 font-mono block pt-1">
                  {pod.episodesCount} Episodes Available
                </span>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Episodes</h4>

              {pod.episodes.map((ep) => {
                const isThisPlaying = currentTrack?.id === ep.id && isPlaying;
                const episodeAsTrack = {
                  id: ep.id,
                  title: ep.title,
                  artist: pod.host,
                  album: pod.title,
                  category: 'Podcast',
                  duration: ep.duration,
                  durationSec: ep.durationSec,
                  cover: pod.cover,
                  audioUrl: ep.audioUrl,
                  lyrics: `Podcast: ${pod.title}\nHost: ${pod.host}\nEpisode: ${ep.title}`
                };

                return (
                  <div
                    key={ep.id}
                    onClick={() => playTrack(episodeAsTrack, [episodeAsTrack])}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between gap-4 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                        {isThisPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                      </button>
                      <div>
                        <h5 className="text-white font-bold text-sm group-hover:text-amber-300 transition-colors">
                          {ep.title}
                        </h5>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> {ep.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-400" /> {ep.publishedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
