import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import * as omdb from '@/lib/api/omdb';
import type { TMDBMovie, OMDbRatings } from '@/lib/api/types';

export function useMovieDetails(movieId: number) {
  const movieQuery = useQuery<TMDBMovie>({
    queryKey: ['movie', movieId],
    queryFn: () => tmdb.getMovieDetails(movieId),
    staleTime: 30 * 60 * 1000,
    enabled: !!movieId,
  });

  const imdbId = movieQuery.data?.imdb_id;

  const ratingsQuery = useQuery<OMDbRatings | null>({
    queryKey: ['omdb', imdbId],
    queryFn: () => omdb.getRatings(imdbId!),
    staleTime: 30 * 60 * 1000,
    enabled: !!imdbId,
  });

  return {
    movie: movieQuery.data,
    ratings: ratingsQuery.data,
    isLoading: movieQuery.isLoading,
    isRatingsLoading: ratingsQuery.isLoading,
    error: movieQuery.error ?? ratingsQuery.error,
  };
}
