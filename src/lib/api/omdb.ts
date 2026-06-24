// =============================================================================
// WhichOTT – OMDb API Client
// Fetches external ratings (IMDb, Rotten Tomatoes, Metacritic) for a title.
// =============================================================================

import axios from 'axios';
import type { OMDbRatings } from './types';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const omdbClient = axios.create({
  baseURL: OMDB_BASE_URL,
  timeout: 10_000,
});

/**
 * Fetch external ratings for a title by its IMDb ID.
 *
 * Returns `null` when:
 * - The IMDb ID is falsy or empty.
 * - The OMDb API returns `Response: "False"`.
 * - Any network / parsing error occurs.
 *
 * This ensures the rest of the app can treat missing ratings gracefully
 * without needing try/catch at every call site.
 */
export async function getRatings(
  imdbId: string,
): Promise<OMDbRatings | null> {
  if (!imdbId) return null;

  try {
    const { data } = await omdbClient.get<OMDbRatings>('/', {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'short',
      },
    });

    // OMDb returns { Response: "False", Error: "..." } on failure.
    if (data.Response === 'False') {
      return null;
    }

    return data;
  } catch {
    // Network errors, timeouts, etc. – fail silently.
    return null;
  }
}
