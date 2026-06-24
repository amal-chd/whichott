import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuickMovieDetails, getQuickTVDetails } from '@/lib/api/tmdb';
import type { ContentType } from '@/lib/api/types';
import { useCountry } from '@/context/CountryContext';
import { useWatchProviders } from '@/hooks/useWatchProviders';
import { Skeleton } from './Skeleton';
import { Star } from 'lucide-react';

interface MediaHoverDetailsProps {
  id: number;
  mediaType: ContentType;
}

export function MediaHoverDetails({ id, mediaType }: MediaHoverDetailsProps) {
  const { country } = useCountry();

  const { data, isLoading } = useQuery<any>({
    queryKey: ['quick-details', mediaType, id],
    queryFn: () => mediaType === 'movie' ? getQuickMovieDetails(id) : getQuickTVDetails(id),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Extract Age Rating
  let ageRating = '';
  if (data) {
    if (mediaType === 'movie') {
      const releases = data.release_dates?.results?.find((r: any) => r.iso_3166_1 === country || r.iso_3166_1 === 'US');
      ageRating = releases?.release_dates?.[0]?.certification || '';
    } else {
      const ratings = data.content_ratings?.results?.find((r: any) => r.iso_3166_1 === country || r.iso_3166_1 === 'US');
      ageRating = ratings?.rating || '';
    }
  }

  // Extract Runtime
  let runtimeStr = '';
  if (data) {
    if (mediaType === 'movie') {
      const runtime = data.runtime;
      if (runtime) {
        const h = Math.floor(runtime / 60);
        const m = runtime % 60;
        runtimeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
      }
    } else {
      const seasons = data.number_of_seasons;
      if (seasons) {
        runtimeStr = `${seasons} Season${seasons > 1 ? 's' : ''}`;
      }
    }
  }

  const { stream } = useWatchProviders(data?.['watch/providers'], country);
  const providers = stream.slice(0, 4); // Show top 4 streaming providers

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex gap-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-16" /></div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Meta info row */}
      <div className="flex items-center gap-2 text-xs font-medium text-white/80">
        {data.vote_average > 0 && (
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" /> {(data.vote_average).toFixed(1)}
          </span>
        )}
        {data.vote_average > 0 && <span className="w-1 h-1 rounded-full bg-white/20" />}
        {ageRating && (
          <>
            <span className="border border-white/20 px-1.5 rounded-sm">{ageRating}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
          </>
        )}
        {runtimeStr && <span>{runtimeStr}</span>}
      </div>

      {/* Genres */}
      {data.genres && data.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.genres.slice(0, 3).map((g: any) => (
            <span key={g.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              {g.name}
            </span>
          ))}
        </div>
      )}

      {/* Plot */}
      <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
        {data.overview || 'No overview available.'}
      </p>

      {/* Where to Watch snippet */}
      {providers.length > 0 && (
        <div className="mt-1 pt-3 border-t border-white/10 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Stream:</span>
          <div className="flex -space-x-1">
            {providers.map((p: any) => (
              <div key={p.provider_id} className="w-6 h-6 rounded-full border-2 border-[#1a1a1a] overflow-hidden bg-black shadow-sm">
                <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
