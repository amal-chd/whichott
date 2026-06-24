import { useState, useEffect } from 'react';

/**
 * Debounce a rapidly-changing value.
 *
 * @param value  – The value to debounce.
 * @param delay  – Debounce window in milliseconds.
 * @returns The debounced value (updates `delay` ms after the last change).
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 300);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
