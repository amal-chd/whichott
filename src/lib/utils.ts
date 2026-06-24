// =============================================================================
// WhichOTT – Utility Functions
// =============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { COUNTRIES, DEFAULT_COUNTRY } from './constants';

// ---------------------------------------------------------------------------
// Class Name Utility (clsx + tailwind-merge)
// ---------------------------------------------------------------------------

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-purple-600', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Formatting – Runtime
// ---------------------------------------------------------------------------

/**
 * Format a runtime in minutes to a human-readable string.
 *
 * @example
 * formatRuntime(149) // '2h 29m'
 * formatRuntime(45)  // '45m'
 * formatRuntime(0)   // 'N/A'
 */
export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// ---------------------------------------------------------------------------
// Formatting – Dates
// ---------------------------------------------------------------------------

/**
 * Format a date string to a readable format.
 *
 * @example
 * formatDate('2024-01-15') // 'Jan 15, 2024'
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'TBA';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'TBA';
  }
}

/**
 * Extract just the year from a date string.
 *
 * @example
 * formatYear('2024-01-15') // '2024'
 */
export function formatYear(dateStr: string): string {
  if (!dateStr) return 'TBA';

  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return 'TBA';
  }
}

// ---------------------------------------------------------------------------
// Formatting – Currency
// ---------------------------------------------------------------------------

/**
 * Format a dollar amount into a compact representation.
 *
 * @example
 * formatCurrency(150_000_000) // '$150M'
 * formatCurrency(1_200_000)   // '$1.2M'
 * formatCurrency(850_000)     // '$850K'
 * formatCurrency(0)           // 'N/A'
 */
export function formatCurrency(amount: number): string {
  if (!amount || amount <= 0) return 'N/A';

  if (amount >= 1_000_000_000) {
    const value = amount / 1_000_000_000;
    return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    const value = amount / 1_000_000;
    return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const value = amount / 1_000;
    return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`;
  }

  return `$${amount.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Formatting – Vote Count
// ---------------------------------------------------------------------------

/**
 * Format a vote count into a compact string.
 *
 * @example
 * formatVoteCount(2300) // '2.3K'
 * formatVoteCount(150)  // '150'
 */
export function formatVoteCount(count: number): string {
  if (!count || count <= 0) return '0';

  if (count >= 1_000_000) {
    const value = count / 1_000_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
  }
  if (count >= 1_000) {
    const value = count / 1_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`;
  }

  return count.toString();
}

// ---------------------------------------------------------------------------
// Rating Color
// ---------------------------------------------------------------------------

/**
 * Return a Tailwind text-color class based on a 0–10 rating.
 *
 * - ≥ 7.0 → green (good)
 * - ≥ 5.0 → yellow (average)
 * - < 5.0 → red (poor)
 */
export function getRatingColor(rating: number): string {
  if (rating >= 7.0) return 'text-green-400';
  if (rating >= 5.0) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Return a background gradient class string for rating badges.
 */
export function getRatingBgColor(rating: number): string {
  if (rating >= 7.0) return 'bg-green-500/20 border-green-500/30';
  if (rating >= 5.0) return 'bg-yellow-500/20 border-yellow-500/30';
  return 'bg-red-500/20 border-red-500/30';
}

// ---------------------------------------------------------------------------
// Media Type Label
// ---------------------------------------------------------------------------

/**
 * Return a human-readable label for a media type.
 *
 * @example
 * getMediaTypeLabel('movie')  // 'Movie'
 * getMediaTypeLabel('tv')     // 'TV Show'
 * getMediaTypeLabel('person') // 'Person'
 */
export function getMediaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    movie: 'Movie',
    tv: 'TV Show',
    person: 'Person',
  };
  return labels[type] ?? type;
}

// ---------------------------------------------------------------------------
// Text Utilities
// ---------------------------------------------------------------------------

/**
 * Truncate text to a maximum length, appending an ellipsis when shortened.
 *
 * @example
 * truncateText('Hello World', 5) // 'Hello…'
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

// ---------------------------------------------------------------------------
// Country Detection
// ---------------------------------------------------------------------------

/**
 * Attempt to detect the user's country from browser locale settings.
 * Falls back to `DEFAULT_COUNTRY` ('US') when detection fails or the
 * detected country isn't in our supported list.
 */
export function getInitialCountry(): string {
  try {
    // navigator.language returns tags like 'en-US', 'en-GB', 'hi-IN'
    const locale = navigator.language ?? navigator.languages?.[0];
    if (!locale) return DEFAULT_COUNTRY;

    // Extract region subtag (the part after the dash)
    const parts = locale.split('-');
    const region = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;

    if (region && COUNTRIES.some((c) => c.code === region)) {
      return region;
    }

    // Some browsers return just a language code ('en'). Try Intl as fallback.
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const resolved = Intl.DateTimeFormat().resolvedOptions();
      const timeZone = resolved.timeZone ?? '';

      // Map common timezone prefixes to country codes.
      const tzCountryMap: Record<string, string> = {
        'America/New_York': 'US',
        'America/Chicago': 'US',
        'America/Denver': 'US',
        'America/Los_Angeles': 'US',
        'Europe/London': 'GB',
        'Europe/Berlin': 'DE',
        'Europe/Paris': 'FR',
        'Europe/Rome': 'IT',
        'Europe/Madrid': 'ES',
        'Asia/Tokyo': 'JP',
        'Asia/Seoul': 'KR',
        'Asia/Kolkata': 'IN',
        'Asia/Calcutta': 'IN',
        'Asia/Dubai': 'AE',
        'Asia/Singapore': 'SG',
        'Australia/Sydney': 'AU',
        'Australia/Melbourne': 'AU',
        'America/Toronto': 'CA',
        'America/Sao_Paulo': 'BR',
        'America/Mexico_City': 'MX',
      };

      const detected = tzCountryMap[timeZone];
      if (detected && COUNTRIES.some((c) => c.code === detected)) {
        return detected;
      }
    }
  } catch {
    // Silently fall through to default.
  }

  return DEFAULT_COUNTRY;
}
