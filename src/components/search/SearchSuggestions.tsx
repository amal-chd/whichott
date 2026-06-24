import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Skeleton } from '../ui/Skeleton';
import type { TMDBSearchItem } from '@/lib/api/types';

interface SearchSuggestionsProps {
  query: string;
  isVisible: boolean;
  results?: TMDBSearchItem[];
  isLoading: boolean;
  onSelect: () => void;
}

export function SearchSuggestions({ query, isVisible, results = [], isLoading, onSelect }: SearchSuggestionsProps) {
  const navigate = useNavigate();

  if (!isVisible || query.length < 2) return null;

  const handleSelect = (item: TMDBSearchItem) => {
    onSelect();
    const mediaTypeStr = item.media_type?.toString() || '';
    if (mediaTypeStr.startsWith('sports_')) {
      const sportType = mediaTypeStr.replace('sports_', '');
      navigate(`/sports/${sportType}/${item.id}`);
    } else if (item.media_type === 'person') {
      // Phase 2: Person Page. For now, do nothing or redirect to search
      navigate(`/search?q=${encodeURIComponent(item.name || '')}`);
    } else {
      navigate(`/title/${item.media_type}/${item.id}`);
    }
  };

  const getImageUrl = (item: TMDBSearchItem) => {
    if (item.media_type?.toString().startsWith('sports_')) {
      return (item as any).image || null;
    }
    const path = item.media_type === 'person' ? item.profile_path : item.poster_path;
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  };

  const getTitle = (item: TMDBSearchItem) => {
    return (item as any).title || (item as any).name || 'Unknown';
  };

  const getYear = (item: TMDBSearchItem) => {
    const date = (item as any).release_date || (item as any).first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  };

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  // Group and limit results
  const isSports = results.some(r => r.media_type?.toString().startsWith('sports_'));
  
  const movies = results.filter(r => r.media_type === 'movie').slice(0, 4);
  const shows = results.filter(r => r.media_type === 'tv').slice(0, 4);
  const people = results.filter(r => r.media_type === 'person').slice(0, 2);
  
  const displayResults = isSports ? results.slice(0, 8) : [...movies, ...shows, ...people].slice(0, 8);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-strong border border-white/10 shadow-2xl overflow-hidden z-50"
      >
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-14 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayResults.length === 0 ? (
            <div className="p-6 text-center text-text-muted">
              No results found for "{query}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
              {displayResults.map((item) => {
                const img = getImageUrl(item);
                const isItemSports = item.media_type?.toString().startsWith('sports_');
                const isImgEmoji = isItemSports && img && isEmoji(img);

                return (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-4 w-full p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-surface-light shrink-0 shadow-md flex items-center justify-center transition-all">
                      {isImgEmoji ? (
                        <span className="text-3xl">{img}</span>
                      ) : (
                        <ImageWithFallback
                          src={img || ''}
                          alt={getTitle(item)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate transition-colors text-sm">
                        {getTitle(item)}
                      </div>
                      <div className="text-[11px] font-medium text-text-muted mt-1 flex items-center gap-2">
                        <span className="capitalize px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
                          {isItemSports ? item.media_type?.toString().replace('sports_', '') : item.media_type}
                        </span>
                        {isItemSports ? (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="truncate max-w-[120px]">{(item as any).subtitle}</span>
                          </>
                        ) : (
                          ((item as any).release_date || (item as any).first_air_date) && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span>{new Date((item as any).release_date || (item as any).first_air_date).getFullYear()}</span>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  onSelect();
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
                className="col-span-1 sm:col-span-2 w-full mt-2 p-3 text-center text-sm font-medium text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-colors"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
