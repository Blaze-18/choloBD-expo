import { useState, useEffect } from 'react';
import { getActivitySpots, ActivitySpot, ActivitySpotFilters } from '../services/api/activitySpots';

export type { ActivitySpot, ActivitySpotFilters };

export function useFetchActivitySpots(locationIdOrFilters?: string | ActivitySpotFilters) {
  const [spots, setSpots] = useState<ActivitySpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filterKey =
    typeof locationIdOrFilters === 'string'
      ? locationIdOrFilters
      : JSON.stringify(locationIdOrFilters ?? {});

  useEffect(() => {
    if (!locationIdOrFilters || (typeof locationIdOrFilters === 'string' && !locationIdOrFilters)) {
      setSpots([]);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getActivitySpots(locationIdOrFilters);
        if (active) setSpots(data);
      } catch (err: any) {
        if (__DEV__) console.error('[useFetchActivitySpots] error:', err?.message);
        if (active) {
          setError(err?.message || 'Failed to fetch activity spots');
          setSpots([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filterKey]);

  return { spots, isLoading, error };
}
