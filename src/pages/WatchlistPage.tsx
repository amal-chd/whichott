import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { WatchlistStatus } from '@/lib/firebase/watchlist';
import { MediaCard } from '@/components/ui/MediaCard';
import { Skeleton } from '@/components/ui/Skeleton';

export function WatchlistPage() {
  const { user } = useAuth();
  const { watchlist, isLoading } = useWatchlist();
  const [activeTab, setActiveTab] = useState<WatchlistStatus | 'all'>('all');

  const filteredList = activeTab === 'all' 
    ? watchlist 
    : watchlist.filter(item => item.status === activeTab);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center pt-24 pb-12">
        <Helmet><title>Watchlist — WhichOTT</title></Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Your Watchlist</h1>
          <p className="text-text-muted max-w-md mx-auto">
            Please sign in to access your personal watchlist, track what you're watching, and save titles for later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-24 pb-12">
      <Helmet>
        <title>Watchlist — WhichOTT</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">Your Watchlist</h1>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8">
          {[
            { id: 'all', label: 'All' },
            { id: 'want_to_watch', label: 'Want to Watch' },
            { id: 'watching', label: 'Watching' },
            { id: 'watched', label: 'Watched' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]' 
                  : 'bg-surface-light text-text-muted hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
              {tab.id !== 'all' && (
                <span className="ml-2 opacity-60 text-xs">
                  {watchlist.filter(i => i.status === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full bg-surface-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4 opacity-50">🍿</div>
            <h3 className="text-xl font-bold text-white mb-2">Nothing here yet</h3>
            <p className="text-text-muted max-w-md mx-auto">
              Start adding movies and TV shows to your watchlist to keep track of what you want to see.
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {filteredList.map(item => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={`watchlist-${item.mediaId}`}
                >
                  <MediaCard
                    id={item.mediaId}
                    title={item.title}
                    posterPath={item.posterPath}
                    mediaType={item.mediaType}
                    rating={0} // Omitted from watchlist store for brevity
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
