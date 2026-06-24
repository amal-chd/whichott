import React from 'react';
import { Play, Check, Plus, MoreVertical, Share2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist, useWatchlistItem } from '@/hooks/useWatchlist';
import type { WatchlistStatus } from '@/lib/firebase/watchlist';
import type { TMDBMovie, TMDBTVShow, ContentType, WatchProviderResult, OMDbRatings } from '@/lib/api/types';
import { getBackdropUrl, getPosterUrl } from '@/lib/api/tmdb';
import { formatRuntime } from '@/lib/utils';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { GenrePill } from '../ui/GenrePill';
import { Badge } from '../ui/Badge';
import { OTTAvailability } from './OTTAvailability';

interface HeroSectionProps {
  data: TMDBMovie | TMDBTVShow;
  mediaType: ContentType;
  omdbRatings?: OMDbRatings | null;
  watchProviders?: WatchProviderResult;
}

export function HeroSection({ data, mediaType, omdbRatings, watchProviders }: HeroSectionProps) {
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} on WhichOTT`,
          text: `Check out ${title} on WhichOTT!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
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

  // IMDb Rating
  const imdbRating = omdbRatings?.imdbRating && omdbRatings.imdbRating !== 'N/A' ? omdbRatings.imdbRating : null;

  return (
    <div className="relative w-full pt-20 pb-8 md:pt-28 md:pb-12 min-h-[50vh] flex flex-col justify-end overflow-hidden">
      {/* Background Image - Strongly Blurred like JustWatch */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={getBackdropUrl(data.backdrop_path, 'original') || ''}
          alt={title}
          className="w-full h-full object-cover scale-110 blur-3xl opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          
          {/* Desktop Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block w-56 lg:w-72 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <ImageWithFallback
              src={getPosterUrl(data.poster_path, 'w500') || ''}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Right Column: Metadata & Watch Now */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col flex-1 gap-5"
          >
            {/* Mobile Header: Poster + Title */}
            <div className="flex gap-4 md:block">
              <div className="w-28 shrink-0 rounded-lg overflow-hidden shadow-xl border border-white/10 md:hidden">
                <ImageWithFallback
                  src={getPosterUrl(data.poster_path, 'w500') || ''}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex flex-col justify-end md:justify-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  {title}
                </h1>
                {showOriginalTitle && (
                  <h2 className="text-sm md:text-lg text-text-muted mt-1 italic font-medium">
                    {originalTitle}
                  </h2>
                )}

                {/* Sub-Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/80 mt-3">
                  {year && <span>{year}</span>}
                  {ageRating && (
                    <Badge variant="outline" className="px-1.5 py-0 text-xs border-white/20 text-white/90">{ageRating}</Badge>
                  )}
                  {runtime && <span>{formatRuntime(runtime)}</span>}
                  
                  {/* TMDB Rating */}
                  {data.vote_average > 0 && (
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md text-white border border-white/10">
                      <Star size={14} className="fill-current text-yellow-500" />
                      <span>{data.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* IMDB Rating */}
                  {imdbRating && (
                    <div className="flex items-center gap-1 bg-[#F5C518]/20 px-2 py-0.5 rounded-md text-[#F5C518] border border-[#F5C518]/30">
                      <span className="font-bold text-xs uppercase tracking-wider">IMDb</span>
                      <span>{imdbRating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Genres */}
            {data.genres && data.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {data.genres.map(genre => (
                  <GenrePill key={genre.id} name={genre.name} />
                ))}
              </div>
            )}

            {/* OTT Availability (Watch Providers) */}
            <div className="mt-2 w-full max-w-2xl">
              <OTTAvailability watchProviders={watchProviders} title={title} compact={true} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-all text-sm"
                onClick={() => {
                  const el = document.getElementById('trailers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play size={18} fill="currentColor" />
                Trailer
              </button>

              <div className="relative">
                <div className="flex items-center">
                  <button
                    disabled={isMutating}
                    onClick={handleWatchlistToggle}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 font-bold transition-all border border-white/10 text-sm",
                      isInWatchlist 
                        ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 rounded-l-lg" 
                        : "bg-surface-light text-white hover:bg-white/10 rounded-lg"
                    )}
                  >
                    {isInWatchlist ? <Check size={18} /> : <Plus size={18} />}
                    {isInWatchlist ? (watchlistItem?.status || 'added').replace(/_/g, ' ') : "Watchlist"}
                  </button>
                  
                  {isInWatchlist && (
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-center px-2 py-2.5 bg-primary/20 text-primary rounded-r-lg transition-all border border-l-0 border-primary/30 hover:bg-primary/30"
                    >
                      <MoreVertical size={18} />
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

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center justify-center w-10 h-10 bg-surface-light text-white hover:bg-white/10 rounded-lg transition-all border border-white/10 shrink-0"
                aria-label="Share"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
