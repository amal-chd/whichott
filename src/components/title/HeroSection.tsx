import React from 'react';
import { Play, Check, Plus, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist, useWatchlistItem } from '@/hooks/useWatchlist';
import type { WatchlistStatus } from '@/lib/firebase/watchlist';
import type { TMDBMovie, TMDBTVShow, ContentType } from '@/lib/api/types';
import { getBackdropUrl, getPosterUrl } from '@/lib/api/tmdb';
import { formatRuntime } from '@/lib/utils';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { GenrePill } from '../ui/GenrePill';
import { Badge } from '../ui/Badge';

interface HeroSectionProps {
  data: TMDBMovie | TMDBTVShow;
  mediaType: ContentType;
}

export function HeroSection({ data, mediaType }: HeroSectionProps) {
  const { user } = useAuth();
  const isMovie = mediaType === 'movie';
  const id = data.id;
  const title = isMovie ? (data as TMDBMovie).title : (data as TMDBTVShow).name;
  const posterPath = data.poster_path;
  
  const { addItem, updateStatus, removeItem, isMutating } = useWatchlist();
  const { data: watchlistItem } = useWatchlistItem(id);
  const isInWatchlist = !!watchlistItem;

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showAuthWarning, setShowAuthWarning] = React.useState(false);

  const handleWatchlistToggle = async () => {
    if (!user) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 3000);
      return;
    }

    if (isInWatchlist) {
      await removeItem(id);
    } else {
      await addItem({
        mediaId: id,
        mediaType: isMovie ? 'movie' : 'tv',
        title,
        posterPath
      });
    }
  };

  const handleStatusChange = async (status: WatchlistStatus) => {
    if (!user) return;
    setIsDropdownOpen(false);
    await updateStatus({ mediaId: id, status });
  };

  const originalTitle = isMovie ? (data as TMDBMovie).original_title : (data as TMDBTVShow).original_name;
  const showOriginalTitle = originalTitle && originalTitle !== title;
  
  const releaseDate = isMovie ? (data as TMDBMovie).release_date : (data as TMDBTVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  
  // Calculate runtime
  let runtime = null;
  if (isMovie && (data as TMDBMovie).runtime) {
    runtime = (data as TMDBMovie).runtime;
  } else if (!isMovie && (data as TMDBTVShow).episode_run_time?.length) {
    runtime = (data as TMDBTVShow).episode_run_time[0];
  }

  // Find age rating
  let ageRating = null;
  if (isMovie) {
    const releases = (data as any).release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US');
    ageRating = releases?.release_dates[0]?.certification;
  } else {
    const ratings = (data as TMDBTVShow).content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US');
    ageRating = ratings?.rating;
  }

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col justify-end pt-24 pb-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={getBackdropUrl(data.backdrop_path, 'original') || ''}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-gradient" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
          
          {/* Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-48 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <ImageWithFallback
              src={getPosterUrl(data.poster_path, 'w500') || ''}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 text-center md:text-left"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                {title}
              </h1>
              {showOriginalTitle && (
                <h2 className="text-xl md:text-2xl text-text-muted mt-1 italic font-medium">
                  {originalTitle}
                </h2>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium">
              {year && <span className="text-white drop-shadow">{year}</span>}
              {year && runtime && <span className="text-text-muted">•</span>}
              {runtime && <span className="text-white drop-shadow">{formatRuntime(runtime)}</span>}
              
              {ageRating && (
                <>
                  <span className="text-text-muted">•</span>
                  <Badge variant="outline">{ageRating}</Badge>
                </>
              )}
            </div>

            {data.genres && data.genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                {data.genres.map(genre => (
                  <GenrePill key={genre.id} name={genre.name} />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105"
                onClick={() => {
                  const el = document.getElementById('trailers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play size={20} fill="currentColor" />
                Watch Trailer
              </button>

              <div className="relative">
                <div className="flex items-center">
                  <button
                    disabled={isMutating}
                    onClick={handleWatchlistToggle}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-bold transition-all border border-white/20",
                      isInWatchlist 
                        ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 rounded-l-full" 
                        : "bg-surface-light text-white hover:bg-white/10 rounded-full"
                    )}
                  >
                    {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
                    {isInWatchlist ? (watchlistItem?.status || 'added').replace(/_/g, ' ') : "Watchlist"}
                  </button>
                  
                  {isInWatchlist && (
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-center px-2 py-3 bg-primary/20 text-primary rounded-r-full transition-all border border-l-0 border-primary/30 hover:bg-primary/30"
                    >
                      <MoreVertical size={20} />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <button onClick={() => handleStatusChange('want_to_watch')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors", watchlistItem?.status === 'want_to_watch' && 'text-primary')}>Want to Watch</button>
                      <button onClick={() => handleStatusChange('watching')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors", watchlistItem?.status === 'watching' && 'text-primary')}>Watching</button>
                      <button onClick={() => handleStatusChange('watched')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors", watchlistItem?.status === 'watched' && 'text-primary')}>Watched</button>
                    </motion.div>
                  )}
                  {showAuthWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-red-500/90 text-white text-sm py-2 px-3 rounded-lg shadow-xl z-50 backdrop-blur-md"
                    >
                      Please sign in to use the watchlist.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
