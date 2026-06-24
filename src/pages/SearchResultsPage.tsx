import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';
import { MediaCard } from '@/components/ui/MediaCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMode } from '@/context/ModeContext';
import { cn } from '@/lib/utils';
import type { ContentType } from '@/lib/api/types';

export function SearchResultsPage() {
  const { mode } = useMode();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const isSports = mode === 'sports';
  
  // Set active tab depending on mode
  const [activeTab, setActiveTab] = useState<string>('All');
  
  const { data, isLoading, error } = useSearch(query, query.length > 0);
  const results = data?.results || [];

  // Define tabs dynamically
  const tabs = isSports
    ? ['All', 'Matches', 'Teams', 'Players', 'Leagues']
    : ['All', 'Movies', 'TV Shows', 'People'];
  
  // Filter results
  const filteredResults = results.filter((item: any) => {
    if (activeTab === 'All') return true;
    
    if (isSports) {
      if (activeTab === 'Matches') return item.media_type === 'sports_match';
      if (activeTab === 'Teams') return item.media_type === 'sports_team';
      if (activeTab === 'Players') return item.media_type === 'sports_player';
      if (activeTab === 'Leagues') return item.media_type === 'sports_league';
    } else {
      if (activeTab === 'Movies') return item.media_type === 'movie';
      if (activeTab === 'TV Shows') return item.media_type === 'tv';
      if (activeTab === 'People') return item.media_type === 'person';
    }
    return true;
  });

  const handleCardClick = (item: any) => {
    if (isSports) {
      const type = item.media_type.replace('sports_', '');
      navigate(`/sports/${type}/${item.id}`);
    } else {
      navigate(`/title/${item.media_type}/${item.id}`);
    }
  };

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 flex-1">
      <Helmet>
        <title>{query ? `"${query}" - Search Results` : 'Search'} — WhichOTT</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
          <p className="text-text-muted">
            {isLoading ? (
              <span>Searching for "{query}"...</span>
            ) : (
              <span>Found {results.length} results for "<span className="text-white">{query}</span>"</span>
            )}
          </p>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab 
                  ? isSports 
                    ? "bg-blue-600 text-white"
                    : "bg-primary text-white" 
                  : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full aspect-[2/3] rounded-xl bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
              <Skeleton className="h-3 w-1/2 bg-white/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-red-400">Failed to load search results. Please try again.</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-text-muted">We couldn't find any {activeTab.toLowerCase()} matching "{query}".</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          {filteredResults.map((item: any) => (
            <motion.div 
              key={`${item.media_type}-${item.id}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              {isSports ? (
                /* Custom Sports Card */
                <div
                  onClick={() => handleCardClick(item)}
                  className="cursor-pointer group flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-2xl p-4 h-full min-h-[180px] justify-between transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0 overflow-hidden p-1 border border-white/5">
                      {isEmoji(item.image) ? (
                        item.image
                      ) : (
                        <img src={item.image} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 tracking-wider">
                      {item.media_type.replace('sports_', '')}
                    </span>
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <h3 className="font-bold text-white leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ) : (
                /* Standard Entertainment Card */
                <MediaCard
                  id={item.id}
                  title={item.title || item.name || ''}
                  posterPath={item.media_type === 'person' ? item.profile_path : item.poster_path}
                  mediaType={(item.media_type as ContentType) || 'movie'}
                  year={item.release_date ? new Date(item.release_date).getFullYear().toString() : item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() : undefined}
                  rating={item.vote_average}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
