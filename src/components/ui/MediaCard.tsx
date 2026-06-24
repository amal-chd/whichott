import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';
import { getPosterUrl } from '@/lib/api/tmdb';
import { useWatchlist } from '@/hooks/useWatchlist';
import { MediaProviderBadges } from './MediaProviderBadges';
import { MediaHoverDetails } from './MediaHoverDetails';
import { Badge } from './Badge';
import { useAuth } from '@/context/AuthContext';
import { Bookmark, Eye, ThumbsUp, ThumbsDown, Check, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentType } from '@/lib/api/types';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: ContentType | 'person';
  year?: string;
  rating?: number;
  onClick?: () => void;
}

export function MediaCard({ id, title, posterPath, mediaType, year, rating, onClick }: MediaCardProps) {
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : null;
  const { user } = useAuth();
  const { watchlist, addItem, updateInteraction, removeItem } = useWatchlist();
  
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemData = watchlist.find(i => i.mediaId === id);
  const isInWatchlist = !!itemData;
  const isSeen = itemData?.seen || false;
  const liked = itemData?.liked;

  const handleMouseEnter = () => {
    if (mediaType === 'person') return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500); // 500ms delay to prevent accidental triggers while scrolling
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to TitlePage
    if (!user || mediaType === 'person') return; // Optionally open AuthModal here
    
    if (isInWatchlist) {
      removeItem(id);
    } else {
      addItem({ mediaId: id, mediaType: mediaType as ContentType, title, posterPath });
    }
  };

  const handleSeen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || mediaType === 'person') return;
    
    if (!isInWatchlist) {
      addItem({ mediaId: id, mediaType: mediaType as ContentType, title, posterPath }).then(() => {
        updateInteraction({ mediaId: id, seen: true });
      });
    } else {
      updateInteraction({ mediaId: id, seen: !isSeen });
    }
  };

  const handleLike = (e: React.MouseEvent, likeVal: boolean) => {
    e.preventDefault();
    if (!user || mediaType === 'person') return;
    
    const newLikedVal = liked === likeVal ? null : likeVal;
    
    if (!isInWatchlist) {
      addItem({ mediaId: id, mediaType: mediaType as ContentType, title, posterPath }).then(() => {
        updateInteraction({ mediaId: id, liked: newLikedVal });
      });
    } else {
      updateInteraction({ mediaId: id, liked: newLikedVal });
    }
  };
  
  const linkTo = mediaType === 'person' ? `/person/${id}` : `/title/${mediaType}/${id}`;
  
  return (
    <div 
      className="group relative flex flex-col gap-2 w-32 md:w-40 lg:w-48 shrink-0 z-10 hover:z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={linkTo} onClick={onClick} className="relative block cursor-pointer">
        <motion.div 
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-light border border-border shadow-lg transition-all group-hover:shadow-[0_0_20px_rgba(192,38,211,0.2)] group-hover:border-primary/50"
        >
          <ImageWithFallback
            src={posterUrl || ''}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
            <Badge variant="default" size="sm" className="bg-black/60 backdrop-blur-md capitalize">
              {mediaType}
            </Badge>
          </div>
          
          {rating !== undefined && rating > 0 && mediaType !== 'person' && (
            <div className="absolute bottom-2 right-2 z-10">
              <Badge variant={rating >= 7 ? 'primary' : rating >= 5 ? 'secondary' : 'default'} size="sm" className="bg-black/60 backdrop-blur-md font-bold">
                {rating.toFixed(1)}
              </Badge>
            </div>
          )}

          {/* Provider Badges */}
          {mediaType !== 'person' && (
            <div className="absolute bottom-2 left-2 z-10">
              <MediaProviderBadges mediaType={mediaType as ContentType} id={id} />
            </div>
          )}
        </motion.div>
      </Link>
        
      <div className="flex flex-col">
        <Link to={linkTo} onClick={onClick}>
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        </Link>
        {year && <p className="text-xs text-text-muted">{year}</p>}
      </div>

      <AnimatePresence>
        {isHovered && mediaType !== 'person' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100] pointer-events-auto origin-top min-w-[240px] -ml-4"
          >
            <MediaHoverDetails id={id} mediaType={mediaType as ContentType} />
            
            {/* Quick Actions at the bottom of the hover card */}
            {user && (
              <div className="flex justify-around items-center p-3 bg-black/40 border-t border-white/10">
                <button onClick={handleWatchlist} className={cn("text-white/70 hover:text-white transition-all", isInWatchlist && "text-primary")} title="Watchlist">
                  {isInWatchlist ? <Check size={18} /> : <Bookmark size={18} />}
                </button>
                <button onClick={handleSeen} className={cn("text-white/70 hover:text-white transition-all", isSeen && "text-secondary")} title="Seen">
                  <Eye size={18} />
                </button>
                <button onClick={(e) => handleLike(e, true)} className={cn("text-white/70 hover:text-white transition-all", liked === true && "text-green-500")} title="Like">
                  <ThumbsUp size={18} />
                </button>
                <button onClick={(e) => handleLike(e, false)} className={cn("text-white/70 hover:text-white transition-all", liked === false && "text-red-500")} title="Dislike">
                  <ThumbsDown size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
