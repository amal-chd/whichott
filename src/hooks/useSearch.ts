import { useQuery } from '@tanstack/react-query';
import * as tmdb from '@/lib/api/tmdb';
import { searchSports } from '@/lib/api/sportsMock';
import { useMode } from '@/context/ModeContext';
import type { TMDBSearchResult } from '@/lib/api/types';

export function useSearch(query: string, enabled: boolean = true) {
  const { mode } = useMode();
  const trimmed = query.trim();
  const isSports = mode === 'sports';

  const { data, isLoading, error } = useQuery<TMDBSearchResult | any>({
    queryKey: ['search', mode, trimmed],
    queryFn: () => {
      if (isSports) {
        // Map sportsMock search results to TMDBSearchResult structure
        const sportsResults = searchSports(trimmed);
        const mappedResults = sportsResults.map(item => ({
          id: item.id,
          media_type: `sports_${item.type}`, // e.g. sports_match, sports_team, sports_player, sports_league
          title: item.name,
          name: item.name,
          subtitle: item.subtitle,
          sport: item.sport,
          image: item.image,
          poster_path: item.image, // For compatibility
        }));

        return {
          page: 1,
          results: mappedResults,
          total_pages: 1,
          total_results: mappedResults.length
        };
      } else {
        return tmdb.searchMulti(trimmed);
      }
    },
    staleTime: isSports ? 0 : 2 * 60 * 1000, // sports search can be dynamic
    enabled: enabled && trimmed.length >= 2,
  });

  return { data, isLoading, error };
}
