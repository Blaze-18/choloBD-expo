/**
 * Fetch Guides Hook
 * Auto-fetching list hook for browsing and searching guides
 */

import { useCallback, useEffect, useState } from 'react';
import { getGuides, searchGuides } from '../services/api/guides';
import { Guide, GuideFilters } from '../types/guides';

/**
 * Loads guides for the browse screen. When `searchTerm` is a non-empty string
 * the search endpoint is used instead of the plain list endpoint.
 */
export function useFetchGuides(filters?: GuideFilters, searchTerm?: string) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const filterKey = JSON.stringify(filters ?? {});
  const trimmedTerm = searchTerm?.trim() ?? '';

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        if (__DEV__) console.log('[useFetchGuides] Loading guides, term:', trimmedTerm, 'filters:', filters);
        setIsLoading(true);
        setError(null);

        const result = trimmedTerm
          ? await searchGuides({ ...(filters ?? {}), q: trimmedTerm })
          : await getGuides(filters);

        if (active) {
          setGuides(result.results);
          setTotal(result.total);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Failed to load guides');
          setGuides([]);
          setTotal(0);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, trimmedTerm, reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return { guides, total, isLoading, error, refetch };
}
