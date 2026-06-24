// =============================================================================
// WhichOTT – Application Constants
// =============================================================================

import type { ContentType, Country } from './api/types';

// ---------------------------------------------------------------------------
// Supported Countries (for watch-provider region selection)
// ---------------------------------------------------------------------------

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
] as const;

export const DEFAULT_COUNTRY = 'US';

// ---------------------------------------------------------------------------
// Media Types
// ---------------------------------------------------------------------------

export const MEDIA_TYPES: { value: ContentType; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
];

// ---------------------------------------------------------------------------
// TMDB Image Sizes
// ---------------------------------------------------------------------------

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780',
  },
  backdrop: {
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w185',
    large: 'h632',
  },
  logo: {
    small: 'w92',
    medium: 'w154',
    large: 'w300',
  },
  still: {
    small: 'w185',
    medium: 'w300',
    large: 'w500',
  },
} as const;

// ---------------------------------------------------------------------------
// YouTube
// ---------------------------------------------------------------------------

export const YOUTUBE_EMBED_BASE = 'https://www.youtube.com/embed/';

// ---------------------------------------------------------------------------
// Video Types (for filtering TMDB video results)
// ---------------------------------------------------------------------------

export const VIDEO_TYPES = [
  'Trailer',
  'Teaser',
  'Clip',
  'Behind the Scenes',
  'Featurette',
] as const;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/trending', label: 'Trending' },
] as const;
