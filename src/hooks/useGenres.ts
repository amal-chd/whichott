import { useQuery } from '@tanstack/react-query';
import { getGenres } from '@/lib/api/tmdb';
import type { ContentType } from '@/lib/api/types';

export function useGenres(mediaType: ContentType) {
  return useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => getGenres(mediaType),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
