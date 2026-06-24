import { useQuery } from '@tanstack/react-query';
import { getPersonDetails } from '@/lib/api/tmdb';

export function usePersonDetails(id: number) {
  const query = useQuery({
    queryKey: ['person', id],
    queryFn: () => getPersonDetails(id),
    enabled: id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    person: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
