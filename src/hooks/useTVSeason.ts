import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import type { TMDBSeasonDetail } from '@/lib/api/types';

export function useTVSeason(tvId: number, seasonNumber: number, enabled: boolean = true) {
  const query = useQuery<TMDBSeasonDetail>({
    queryKey: ['tv', tvId, 'season', seasonNumber],
    queryFn: () => tmdb.getTVSeason(tvId, seasonNumber),
    staleTime: 60 * 60 * 1000,
    enabled: !!tvId && seasonNumber >= 0 && enabled,
  });

  return {
    season: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
