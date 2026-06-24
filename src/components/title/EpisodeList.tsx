import React from 'react';
import type { TMDBEpisode } from '@/lib/api/types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/lib/utils';
import { RatingCircle } from '../ui/RatingCircle';

interface EpisodeListProps {
  episodes: TMDBEpisode[];
  isLoading: boolean;
}

export function EpisodeList({ episodes, isLoading }: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <Skeleton className="w-full md:w-48 h-32 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-1/4 h-4" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return <p className="text-text-muted mt-4 p-4 text-center">No episodes available.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {episodes.map(episode => (
        <div 
          key={episode.id}
          className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="relative w-full md:w-48 xl:w-56 aspect-video rounded-lg overflow-hidden shrink-0 bg-surface-light">
            <ImageWithFallback
              src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : ''}
              alt={episode.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
              E{episode.episode_number}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-white leading-tight">
                  {episode.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-text-muted">
                  {episode.air_date && <span>{formatDate(episode.air_date)}</span>}
                  {episode.air_date && episode.runtime && <span>•</span>}
                  {episode.runtime && <span>{episode.runtime} min</span>}
                </div>
              </div>
              
              {episode.vote_average > 0 && (
                <div className="shrink-0 hidden sm:block">
                  <RatingCircle rating={episode.vote_average} size="sm" />
                </div>
              )}
            </div>

            <p className="mt-3 text-sm text-text-muted/90 line-clamp-3 leading-relaxed">
              {episode.overview || "No overview available for this episode."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
