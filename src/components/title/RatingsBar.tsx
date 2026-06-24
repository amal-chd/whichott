import React from 'react';
import { Star } from 'lucide-react';
import { RatingCircle } from '../ui/RatingCircle';
import { formatVoteCount } from '@/lib/utils';
import type { OMDbRatings } from '@/lib/api/types';

interface RatingsBarProps {
  tmdbRating: number;
  tmdbVoteCount: number;
  omdbRatings?: OMDbRatings | null;
}

export function RatingsBar({ tmdbRating, tmdbVoteCount, omdbRatings }: RatingsBarProps) {
  // Extract Rotten Tomatoes and Metacritic from OMDb Ratings array if available
  const rtRating = omdbRatings?.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value;
  
  // Calculate colors based on scores
  const getMetacriticColor = (scoreStr: string) => {
    const score = parseInt(scoreStr, 10);
    if (isNaN(score)) return 'bg-gray-600';
    if (score >= 61) return 'bg-[#66CC33]'; // Metacritic Green
    if (score >= 40) return 'bg-[#FFCC33]'; // Metacritic Yellow
    return 'bg-[#FF0000]'; // Metacritic Red
  };

  const getRTStatus = (scoreStr: string) => {
    const score = parseInt(scoreStr, 10);
    if (isNaN(score)) return { icon: '🍅', color: 'text-red-500' };
    if (score >= 75) return { icon: '🍅', color: 'text-red-500', isCertified: true }; // Certified Fresh
    if (score >= 60) return { icon: '🍅', color: 'text-red-500' }; // Fresh
    return { icon: '🟢', color: 'text-green-500' }; // Rotten (Splat)
  };

  return (
    <div className="container mx-auto px-4 md:px-8 mt-12">
      <div className="flex flex-wrap items-center gap-6 md:gap-12 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        
        {/* TMDB Rating */}
        <div className="flex items-center gap-4">
          <RatingCircle rating={tmdbRating} size="lg" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wider">TMDB</span>
            <span className="text-xs text-text-muted">{formatVoteCount(tmdbVoteCount)} votes</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-12 bg-white/10" />

        {/* IMDb Rating */}
        {omdbRatings?.imdbRating && omdbRatings.imdbRating !== 'N/A' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#F5C518]">IMDb</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-[#F5C518] text-[#F5C518]" />
                <span className="text-xl font-bold text-white">{omdbRatings.imdbRating}</span>
                <span className="text-sm text-text-muted">/10</span>
              </div>
              <span className="text-xs text-text-muted">{omdbRatings.imdbVotes} votes</span>
            </div>
          </div>
        )}

        {/* Rotten Tomatoes */}
        {rtRating && (
          <>
            <div className="hidden sm:block w-px h-12 bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-3xl" title={parseInt(rtRating) >= 60 ? "Fresh" : "Rotten"}>
                {getRTStatus(rtRating).icon}
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">{rtRating}</span>
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Tomatometer</span>
              </div>
            </div>
          </>
        )}

        {/* Metacritic */}
        {omdbRatings?.Metascore && omdbRatings.Metascore !== 'N/A' && (
          <>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getMetacriticColor(omdbRatings.Metascore)}`}>
                <span className="text-xl font-bold text-white">{omdbRatings.Metascore}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wider">Metascore</span>
                <span className="text-xs text-text-muted">Critic Reviews</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
