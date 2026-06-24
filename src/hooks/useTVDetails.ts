import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import type { TMDBTVShow } from '@/lib/api/types';

export function useTVDetails(tvId: number) {
  const query = useQuery<TMDBTVShow>({
    queryKey: ['tv', tvId],
    queryFn: () => tmdb.getTVDetails(tvId),
    staleTime: 30 * 60 * 1000,
    enabled: !!tvId,
  });

  return {
    show: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
