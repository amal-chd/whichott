// =============================================================================
// WhichOTT – API Type Definitions
// Complete TypeScript interfaces for TMDB & OMDb API responses.
// =============================================================================

// ---------------------------------------------------------------------------
// Shared / Utility Types
// ---------------------------------------------------------------------------

/** Discriminated union literal for content type. */
export type ContentType = 'movie' | 'tv';

/** Country entry used for the region selector. */
export interface Country {
  code: string;
  name: string;
  flag: string;
}

// ---------------------------------------------------------------------------
// TMDB – Generic Paginated Response
// ---------------------------------------------------------------------------

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ---------------------------------------------------------------------------
// TMDB – Search
// ---------------------------------------------------------------------------

export interface TMDBSearchMovieItem {
  media_type: 'movie';
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface TMDBSearchTVItem {
  media_type: 'tv';
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  origin_country: string[];
}

export interface TMDBSearchPersonItem {
  media_type: 'person';
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  gender: number;
  adult: boolean;
  known_for: (TMDBSearchMovieItem | TMDBSearchTVItem)[];
}

/** Union of possible search result items with `media_type` discriminator. */
export type TMDBSearchItem =
  | TMDBSearchMovieItem
  | TMDBSearchTVItem
  | TMDBSearchPersonItem;

/** Top-level multi-search response. */
export type TMDBSearchResult = TMDBPaginatedResponse<TMDBSearchItem>;

// ---------------------------------------------------------------------------
// TMDB – Genres
// ---------------------------------------------------------------------------

export interface TMDBGenre {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------------
// TMDB – Credits
// ---------------------------------------------------------------------------

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
  popularity: number;
  gender: number;
  credit_id: string;
  cast_id?: number;
  adult: boolean;
  original_name: string;
}

export interface TMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
  gender: number;
  credit_id: string;
  adult: boolean;
  original_name: string;
}

export interface TMDBCredits {
  cast: TMDBCast[];
  crew: TMDBCrew[];
}

// ---------------------------------------------------------------------------
// TMDB – Videos
// ---------------------------------------------------------------------------

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
  size: number;
}

// ---------------------------------------------------------------------------
// TMDB – Watch Providers
// ---------------------------------------------------------------------------

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
  free?: WatchProvider[];
}

export interface WatchProviderResult {
  results: Record<string, WatchProviderCountry>;
}

// ---------------------------------------------------------------------------
// TMDB – Production & Spoken Languages
// ---------------------------------------------------------------------------

export interface TMDBProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  iso_639_1: string;
  english_name: string;
  name: string;
}

// ---------------------------------------------------------------------------
// TMDB – Keywords & Reviews
// ---------------------------------------------------------------------------

export interface TMDBKeyword {
  id: number;
  name: string;
}

export interface TMDBReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBReview {
  id: string;
  author: string;
  author_details: TMDBReviewAuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// ---------------------------------------------------------------------------
// TMDB – Movie Details (full, with appended responses)
// ---------------------------------------------------------------------------

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  genres: TMDBGenre[];
  vote_average: number;
  vote_count: number;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  original_language: string;
  imdb_id: string | null;
  adult: boolean;
  homepage: string | null;
  popularity: number;
  video: boolean;
  production_countries: TMDBProductionCountry[];
  spoken_languages: TMDBSpokenLanguage[];
  production_companies: TMDBProductionCompany[];
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  // Appended responses
  credits: TMDBCredits;
  videos: { results: TMDBVideo[] };
  'watch/providers': WatchProviderResult;
  recommendations: TMDBPaginatedResponse<TMDBSearchMovieItem>;
  similar: TMDBPaginatedResponse<TMDBSearchMovieItem>;
  keywords: { keywords: TMDBKeyword[] };
  reviews: TMDBPaginatedResponse<TMDBReview>;
}

// ---------------------------------------------------------------------------
// TMDB – TV Show Details (full, with appended responses)
// ---------------------------------------------------------------------------

export interface TMDBNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDBCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}

export interface TMDBContentRating {
  descriptors: string[];
  iso_3166_1: string;
  rating: string;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: TMDBGenre[];
  vote_average: number;
  vote_count: number;
  status: string;
  type: string;
  tagline: string;
  homepage: string | null;
  popularity: number;
  original_language: string;
  origin_country: string[];
  in_production: boolean;
  networks: TMDBNetwork[];
  created_by: TMDBCreatedBy[];
  seasons: TMDBSeason[];
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  spoken_languages: TMDBSpokenLanguage[];
  last_episode_to_air: TMDBEpisode | null;
  next_episode_to_air: TMDBEpisode | null;
  // Appended responses
  credits: TMDBCredits;
  videos: { results: TMDBVideo[] };
  'watch/providers': WatchProviderResult;
  recommendations: TMDBPaginatedResponse<TMDBSearchTVItem>;
  similar: TMDBPaginatedResponse<TMDBSearchTVItem>;
  keywords: { results: TMDBKeyword[] };
  reviews: TMDBPaginatedResponse<TMDBReview>;
  content_ratings: { results: TMDBContentRating[] };
}

// ---------------------------------------------------------------------------
// TMDB – Episodes & Season Detail
// ---------------------------------------------------------------------------

export interface TMDBEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  production_code: string;
  show_id?: number;
  crew?: TMDBCrew[];
  guest_stars?: TMDBCast[];
}

export interface TMDBSeasonDetail extends TMDBSeason {
  episodes: TMDBEpisode[];
}

// ---------------------------------------------------------------------------
// TMDB – Person
// ---------------------------------------------------------------------------

export interface TMDBPersonCombinedCreditsCast {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  character: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  overview: string;
  genre_ids: number[];
  credit_id: string;
  episode_count?: number;
}

export interface TMDBPersonCombinedCreditsCrew {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  job: string;
  department: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  overview: string;
  genre_ids: number[];
  credit_id: string;
}

export interface TMDBPersonCombinedCredits {
  cast: TMDBPersonCombinedCreditsCast[];
  crew: TMDBPersonCombinedCreditsCrew[];
}

export interface TMDBExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
  wikidata_id: string | null;
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  gender: number;
  popularity: number;
  adult: boolean;
  homepage: string | null;
  also_known_as: string[];
  imdb_id: string | null;
  combined_credits: TMDBPersonCombinedCredits;
  external_ids: TMDBExternalIds;
}

// ---------------------------------------------------------------------------
// TMDB – Trending & Discover Items
// ---------------------------------------------------------------------------

export interface TMDBTrendingMovieItem {
  id: number;
  media_type: 'movie';
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface TMDBTrendingTVItem {
  id: number;
  media_type: 'tv';
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  origin_country: string[];
}

export type TMDBTrendingItem = TMDBTrendingMovieItem | TMDBTrendingTVItem;

export interface TMDBDiscoverMovieItem {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface TMDBDiscoverTVItem {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  origin_country: string[];
}

// ---------------------------------------------------------------------------
// OMDb
// ---------------------------------------------------------------------------

export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface OMDbRatings {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
