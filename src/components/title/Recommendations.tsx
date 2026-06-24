import React from 'react';
import { HorizontalScroll } from '../ui/HorizontalScroll';
import { MediaCard } from '../ui/MediaCard';
import type { TMDBSearchItem } from '@/lib/api/types';

interface RecommendationsProps {
  recommendations?: TMDBSearchItem[];
  similar?: TMDBSearchItem[];
}

export function Recommendations({ recommendations = [], similar = [] }: RecommendationsProps) {
  if (recommendations.length === 0 && similar.length === 0) return null;

  return (
    <div className="container mx-auto mt-16 mb-24 space-y-12">
      {recommendations.length > 0 && (
        <HorizontalScroll title="Recommendations">
          {recommendations.map(item => (
            <MediaCard
              key={`rec-${item.id}`}
              id={item.id}
              title={(item as any).title || (item as any).name || ''}
              posterPath={(item as any).poster_path}
              mediaType={(item as any).media_type || 'movie'}
              year={(item as any).release_date ? new Date((item as any).release_date).getFullYear().toString() : (item as any).first_air_date ? new Date((item as any).first_air_date).getFullYear().toString() : undefined}
              rating={(item as any).vote_average}
            />
          ))}
        </HorizontalScroll>
      )}

      {similar.length > 0 && (
        <HorizontalScroll title="Similar Titles">
          {similar.map(item => (
            <MediaCard
              key={`sim-${item.id}`}
              id={item.id}
              title={(item as any).title || (item as any).name || ''}
              posterPath={(item as any).poster_path}
              mediaType={(item as any).media_type || ((item as any).title ? 'movie' : 'tv')} // API sometimes omits media_type for similar
              year={(item as any).release_date ? new Date((item as any).release_date).getFullYear().toString() : (item as any).first_air_date ? new Date((item as any).first_air_date).getFullYear().toString() : undefined}
              rating={(item as any).vote_average}
            />
          ))}
        </HorizontalScroll>
      )}
    </div>
  );
}
