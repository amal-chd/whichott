import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TMDBVideo } from '@/lib/api/types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { cn } from '@/lib/utils';
import { YOUTUBE_EMBED_BASE } from '@/lib/constants';

interface TrailersProps {
  videos: TMDBVideo[];
}

export function Trailers({ videos }: TrailersProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Trailer' | 'Teaser' | 'Clip' | 'Behind the Scenes'>('Trailer');
  const [activeVideo, setActiveVideo] = useState<TMDBVideo | null>(null);

  // Filter YouTube videos
  const youtubeVideos = videos?.filter(v => v.site === 'YouTube') || [];
  
  if (youtubeVideos.length === 0) return null;

  // Filter by tab
  const filteredVideos = activeTab === 'All' 
    ? youtubeVideos 
    : youtubeVideos.filter(v => v.type === activeTab);

  // Fallback to 'All' if selected tab is empty
  const displayVideos = filteredVideos.length > 0 ? filteredVideos : youtubeVideos;
  
  const tabs = ['All', 'Trailer', 'Teaser', 'Clip', 'Behind the Scenes'];
  const availableTabs = tabs.filter(tab => 
    tab === 'All' || youtubeVideos.some(v => v.type === tab)
  );

  return (
    <div className="container mx-auto px-4 md:px-8 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Videos & Trailers</h2>
        
        {availableTabs.length > 2 && (
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 md:pb-0">
            {availableTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab 
                    ? "bg-primary text-white" 
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayVideos.slice(0, 8).map(video => (
          <div 
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group cursor-pointer flex flex-col gap-2"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-light border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
              <ImageWithFallback
                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                alt={video.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center pl-1 shadow-[0_0_15px_rgba(192,38,211,0.6)] transform group-hover:scale-110 transition-transform">
                  <Play size={24} />
                </div>
              </div>
            </div>
            <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary transition-colors">
              {video.name}
            </h4>
            <span className="text-xs text-text-muted">{video.type}</span>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${YOUTUBE_EMBED_BASE}${activeVideo.key}?autoplay=1`}
                title={activeVideo.name}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
