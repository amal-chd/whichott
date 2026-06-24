import { useInfiniteQuery } from '@tanstack/react-query';
import { discoverMovie, discoverTV } from '@/lib/api/tmdb';
import type { DiscoverFilters } from '@/lib/api/tmdb';
import type { ContentType } from '@/lib/api/types';
import { useCountry } from '@/context/CountryContext';
import { useProviders } from '@/context/ProviderContext';

export function useDiscover(mediaType: ContentType, filters: Omit<DiscoverFilters, 'page' | 'watch_region' | 'with_watch_providers'>) {
  const { country } = useCountry();
  const { selectedProviders } = useProviders();

  return useInfiniteQuery({
    queryKey: ['discover', mediaType, country, selectedProviders, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const mergedFilters: DiscoverFilters = {
        ...filters,
        page: pageParam as number,
        watch_region: country,
        // Only append provider filters if the user has selected any
        with_watch_providers: selectedProviders.length > 0 ? selectedProviders.join('|') : undefined,
      };

      if (mediaType === 'movie') {
        return discoverMovie(mergedFilters);
      } else {
        return discoverTV(mergedFilters);
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}
