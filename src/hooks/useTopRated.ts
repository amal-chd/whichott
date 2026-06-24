import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import type { ContentType, TMDBPaginatedResponse, TMDBDiscoverMovieItem, TMDBDiscoverTVItem } from '@/lib/api/types';

export function useTopRated(mediaType: ContentType, page: number = 1) {
  return useQuery<TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>>({
    queryKey: ['topRated', mediaType, page],
    queryFn: () => tmdb.getTopRated(mediaType, page),
    staleTime: 30 * 60 * 1000,
  });
}
