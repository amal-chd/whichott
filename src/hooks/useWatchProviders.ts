import { useMemo } from 'react';
import type {
  WatchProviderResult,
  WatchProvider,
} from '@/lib/api/types';

interface WatchProvidersByType {
  /** Subscription streaming (Netflix, Disney+, etc.) */
  stream: WatchProvider[];
  /** Rental options */
  rent: WatchProvider[];
  /** Purchase / buy options */
  buy: WatchProvider[];
  /** Free with ads (Tubi, Pluto TV, etc.) */
  ads: WatchProvider[];
  /** JustWatch attribution link for the selected country */
  link: string | undefined;
}

/**
 * Extract watch-provider lists for a specific country from the TMDB
 * `watch/providers` response.
 *
 * Returns empty arrays when there are no providers for the requested
 * country, so consumers never need to null-check individual categories.
 *
 * @param watchProviders – The `results` object from a TMDB watch-providers
 *                         endpoint (keyed by ISO 3166-1 alpha-2 country code).
 * @param country        – Two-letter country code (e.g. "US", "IN").
 */
export function useWatchProviders(
  watchProviders: WatchProviderResult | undefined,
  country: string,
): WatchProvidersByType {
  return useMemo<WatchProvidersByType>(() => {
    const empty: WatchProvidersByType = {
      stream: [],
      rent: [],
      buy: [],
      ads: [],
      link: undefined,
    };

    if (!watchProviders?.results) return empty;

    const countryData = watchProviders.results[country.toUpperCase()];
    if (!countryData) return empty;

    return {
      stream: countryData.flatrate ?? [],
      rent: countryData.rent ?? [],
      buy: countryData.buy ?? [],
      ads: countryData.ads ?? [],
      link: countryData.link,
    };
  }, [watchProviders, country]);
}
