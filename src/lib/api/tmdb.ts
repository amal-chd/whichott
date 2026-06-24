// =============================================================================
// WhichOTT – TMDB API Client
// Axios-based client for The Movie Database (TMDB) v3 API.
// =============================================================================

import axios from 'axios';
import type {
  ContentType,
  TMDBDiscoverMovieItem,
  TMDBDiscoverTVItem,
  TMDBGenre,
  TMDBMovie,
  TMDBPaginatedResponse,
  TMDBPerson,
  TMDBSearchResult,
  TMDBSeasonDetail,
  TMDBTrendingItem,
  TMDBTVShow,
  WatchProviderResult,
} from './types';

// ---------------------------------------------------------------------------
// Axios Instance
// ---------------------------------------------------------------------------

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE as string;

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15_000,
});

// Attach api_key to every outgoing request.
tmdbClient.interceptors.request.use((config) => {
  config.params = {
    api_key: TMDB_API_KEY,
    ...config.params,
  };
  return config;
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Multi-search across movies, TV shows, and people.
 */
export async function searchMulti(
  query: string,
  page: number = 1,
): Promise<TMDBSearchResult> {
  const { data } = await tmdbClient.get<TMDBSearchResult>('/search/multi', {
    params: { query, page, include_adult: false },
  });
  return data;
}

// ---------------------------------------------------------------------------
// Movie Endpoints
// ---------------------------------------------------------------------------

/**
 * Fetch full movie details with credits, videos, watch providers,
 * recommendations, similar, keywords, and reviews appended.
 */
export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  const { data } = await tmdbClient.get<TMDBMovie>(`/movie/${id}`, {
    params: {
      append_to_response:
        'credits,videos,watch/providers,recommendations,similar,keywords,reviews,release_dates',
    },
  });
  return data;
}

/**
 * Fetch quick movie details for hover cards.
 */
export async function getQuickMovieDetails(id: number): Promise<TMDBMovie> {
  const { data } = await tmdbClient.get<TMDBMovie>(`/movie/${id}`, {
    params: {
      append_to_response: 'watch/providers,release_dates',
    },
  });
  return data;
}

/**
 * Fetch upcoming movies.
 */
export async function getUpcoming(
  page: number = 1,
): Promise<TMDBPaginatedResponse<TMDBDiscoverMovieItem>> {
  const { data } = await tmdbClient.get<
    TMDBPaginatedResponse<TMDBDiscoverMovieItem>
  >('/movie/upcoming', { params: { page } });
  return data;
}

// ---------------------------------------------------------------------------
// TV Endpoints
// ---------------------------------------------------------------------------

/**
 * Fetch full TV show details with credits, videos, watch providers,
 * recommendations, similar, keywords, reviews, and content ratings appended.
 */
export async function getTVDetails(id: number): Promise<TMDBTVShow> {
  const { data } = await tmdbClient.get<TMDBTVShow>(`/tv/${id}`, {
    params: {
      append_to_response:
        'credits,videos,watch/providers,recommendations,similar,keywords,reviews,content_ratings',
    },
  });
  return data;
}

/**
 * Fetch quick TV show details for hover cards.
 */
export async function getQuickTVDetails(id: number): Promise<TMDBTVShow> {
  const { data } = await tmdbClient.get<TMDBTVShow>(`/tv/${id}`, {
    params: {
      append_to_response: 'watch/providers,content_ratings',
    },
  });
  return data;
}

/**
 * Fetch detailed season information including all episodes.
 */
export async function getTVSeason(
  tvId: number,
  seasonNumber: number,
): Promise<TMDBSeasonDetail> {
  const { data } = await tmdbClient.get<TMDBSeasonDetail>(
    `/tv/${tvId}/season/${seasonNumber}`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Trending
// ---------------------------------------------------------------------------

/**
 * Fetch trending content.
 * @param mediaType 'all' | 'movie' | 'tv'
 * @param timeWindow 'day' | 'week'
 */
export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'day',
): Promise<TMDBPaginatedResponse<TMDBTrendingItem>> {
  const { data } = await tmdbClient.get<
    TMDBPaginatedResponse<TMDBTrendingItem>
  >(`/trending/${mediaType}/${timeWindow}`);
  return data;
}

// ---------------------------------------------------------------------------
// Popular & Top Rated
// ---------------------------------------------------------------------------

/**
 * Fetch popular movies or TV shows.
 */
export async function getPopular(
  mediaType: ContentType,
  page: number = 1,
): Promise<
  TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
> {
  const { data } = await tmdbClient.get<
    TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
  >(`/${mediaType}/popular`, { params: { page } });
  return data;
}

/**
 * Fetch top-rated movies or TV shows.
 */
export async function getTopRated(
  mediaType: ContentType,
  page: number = 1,
): Promise<
  TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
> {
  const { data } = await tmdbClient.get<
    TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
  >(`/${mediaType}/top_rated`, { params: { page } });
  return data;
}

// ---------------------------------------------------------------------------
// Person
// ---------------------------------------------------------------------------

/**
 * Fetch person details with combined credits and external IDs appended.
 */
export async function getPersonDetails(id: number): Promise<TMDBPerson> {
  const { data } = await tmdbClient.get<TMDBPerson>(`/person/${id}`, {
    params: { append_to_response: 'combined_credits,external_ids' },
  });
  return data;
}

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

/**
 * Fetch the list of genres for movies or TV shows.
 */
export async function getGenres(
  mediaType: ContentType,
): Promise<TMDBGenre[]> {
  const { data } = await tmdbClient.get<{ genres: TMDBGenre[] }>(
    `/genre/${mediaType}/list`,
  );
  return data.genres;
}

// ---------------------------------------------------------------------------
// Discover
// ---------------------------------------------------------------------------

/**
 * Discover content by genre.
 */
export async function discoverByGenre(
  mediaType: ContentType,
  genreId: number,
  page: number = 1,
): Promise<
  TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
> {
  const { data } = await tmdbClient.get<
    TMDBPaginatedResponse<TMDBDiscoverMovieItem | TMDBDiscoverTVItem>
  >(`/discover/${mediaType}`, {
    params: {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
    },
  });
  return data;
}

export interface DiscoverFilters {
  with_genres?: string;
  with_watch_providers?: string;
  watch_region?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  'vote_average.gte'?: number;
  sort_by?: string;
  page?: number;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'first_air_date.gte'?: string;
  'first_air_date.lte'?: string;
  with_watch_monetization_types?: string;
  certification_country?: string;
  certification?: string;
}

export async function discoverMovie(
  filters: DiscoverFilters,
): Promise<TMDBPaginatedResponse<TMDBDiscoverMovieItem>> {
  const { data } = await tmdbClient.get<TMDBPaginatedResponse<TMDBDiscoverMovieItem>>('/discover/movie', {
    params: {
      include_adult: false,
      include_video: false,
      ...filters,
    },
  });
  return data;
}

export async function discoverTV(
  filters: DiscoverFilters,
): Promise<TMDBPaginatedResponse<TMDBDiscoverTVItem>> {
  const { data } = await tmdbClient.get<TMDBPaginatedResponse<TMDBDiscoverTVItem>>('/discover/tv', {
    params: {
      include_adult: false,
      include_null_first_air_dates: false,
      ...filters,
    },
  });
  return data;
}

export async function getWatchProviders(
  mediaType: ContentType,
  watchRegion: string = 'US',
): Promise<any> {
  const { data } = await tmdbClient.get(`/watch/providers/${mediaType}`, {
    params: {
      watch_region: watchRegion,
    },
  });
  return data;
}

export async function getItemWatchProviders(
  mediaType: ContentType,
  id: number
): Promise<WatchProviderResult> {
  const { data } = await tmdbClient.get<WatchProviderResult>(`/${mediaType}/${id}/watch/providers`);
  return data;
}

// ---------------------------------------------------------------------------
// Image URL Helpers
// ---------------------------------------------------------------------------

const PLACEHOLDER_POSTER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750" fill="%23111"%3E%3Crect width="500" height="750"/%3E%3Ctext x="250" y="375" text-anchor="middle" fill="%23555" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';

const PLACEHOLDER_BACKDROP =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" fill="%23111"%3E%3Crect width="1280" height="720"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="%23555" font-size="32"%3ENo Image%3C/text%3E%3C/svg%3E';

const PLACEHOLDER_PROFILE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="185" height="278" fill="%23111"%3E%3Crect width="185" height="278"/%3E%3Ctext x="92" y="139" text-anchor="middle" fill="%23555" font-size="16"%3ENo Photo%3C/text%3E%3C/svg%3E';

/**
 * Build a full TMDB image URL. Returns an inline SVG placeholder when
 * `path` is null or undefined.
 */
export function getImageUrl(
  path: string | null,
  size: string,
): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Shorthand for poster images.
 */
export function getPosterUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' = 'w500',
): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Shorthand for backdrop images.
 */
export function getBackdropUrl(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280',
): string {
  if (!path) return PLACEHOLDER_BACKDROP;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Shorthand for person profile images.
 */
export function getProfileUrl(
  path: string | null,
  size: 'w185' | 'h632' = 'w185',
): string {
  if (!path) return PLACEHOLDER_PROFILE;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
