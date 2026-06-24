import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import type { TMDBPaginatedResponse, TMDBTrendingItem } from '@/lib/api/types';

export function useTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day') {
  return useQuery<TMDBPaginatedResponse<TMDBTrendingItem>>({
    queryKey: ['trending', mediaType, timeWindow],
    queryFn: () => tmdb.getTrending(mediaType, timeWindow),
    staleTime: 10 * 60 * 1000,
  });
}
