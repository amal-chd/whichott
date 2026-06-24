import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CountryContextType {
  /** ISO 3166-1 alpha-2 country code (e.g. "US", "IN", "GB") */
  country: string;
  /** Update the selected country – persists to localStorage */
  setCountry: (code: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'whichott_country';
const DEFAULT_COUNTRY = 'US';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to derive a two-letter country code from the browser's locale.
 * navigator.language is typically "en-US", "fr-FR", etc.
 * We grab the region subtag when available, otherwise fall back to
 * DEFAULT_COUNTRY.
 */
function detectCountryFromLocale(): string {
  try {
    const locale = navigator.language ?? navigator.languages?.[0];
    if (!locale) return DEFAULT_COUNTRY;

    // Intl.Locale gives us a structured parse of the locale string.
    const parsed = new Intl.Locale(locale);
    if (parsed.region) return parsed.region.toUpperCase();

    // Fallback: split on "-" or "_" and use the second segment.
    const parts = locale.split(/[-_]/);
    if (parts.length >= 2 && parts[1].length === 2) {
      return parts[1].toUpperCase();
    }
  } catch {
    // Intl.Locale may not be available in every environment.
  }

  return DEFAULT_COUNTRY;
}

/**
 * Resolve the initial country by checking localStorage first,
 * then falling back to browser locale detection.
 */
function resolveInitialCountry(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.length === 2) return stored.toUpperCase();
  } catch {
    // localStorage may be blocked (e.g. incognito in some browsers).
  }

  return detectCountryFromLocale();
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CountryContext = createContext<CountryContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface CountryProviderProps {
  children: ReactNode;
}

export function CountryProvider({ children }: CountryProviderProps) {
  const [country, setCountryState] = useState<string>(resolveInitialCountry);

  // Persist every change to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, country);
    } catch {
      // Silently ignore write failures.
    }
  }, [country]);

  const setCountry = useCallback((code: string) => {
    setCountryState(code.toUpperCase());
  }, []);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the current country code and its setter.
 * Must be used inside a `<CountryProvider>`.
 */
export function useCountry(): CountryContextType {
  const ctx = useContext(CountryContext);
  if (ctx === undefined) {
    throw new Error('useCountry must be used within a <CountryProvider>');
  }
  return ctx;
}
