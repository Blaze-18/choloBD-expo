/**
 * Fetch Guide Detail Hook
 * Loads a single guide profile and exposes an on-demand availability check
 */

import { useCallback, useEffect, useState } from 'react';
import { checkGuideAvailability, getGuideById } from '../services/api/guides';
import { Guide, GuideAvailabilityParams, GuideAvailabilityResult } from '../types/guides';

export function useFetchGuideDetail(guideId?: string) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [availability, setAvailability] = useState<GuideAvailabilityResult | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  useEffect(() => {
    if (!guideId) return;
    let active = true;

    const load = async () => {
      try {
        if (__DEV__) console.log('[useFetchGuideDetail] Loading guide:', guideId);
        setIsLoading(true);
        setError(null);
        const data = await getGuideById(guideId);
        if (active) setGuide(data);
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Failed to load guide details');
          setGuide(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [guideId, reloadKey]);

  /**
   * Checks a requested window against the guide's schedule.
   * Returns null when the request could not be completed.
   */
  const verifyAvailability = useCallback(
    async (params: GuideAvailabilityParams): Promise<GuideAvailabilityResult | null> => {
      if (!guideId) return null;

      try {
        setAvailabilityLoading(true);
        const result = await checkGuideAvailability(guideId, params);
        setAvailability(result);
        return result;
      } catch (err: any) {
        if (__DEV__) console.error('[useFetchGuideDetail] availability error:', err?.message);
        setAvailability(null);
        return null;
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [guideId]
  );

  const clearAvailability = useCallback(() => setAvailability(null), []);

  const refetch = useCallback(() => setReloadKey((prev) => prev + 1), []);

  return {
    guide,
    isLoading,
    error,
    refetch,
    availability,
    availabilityLoading,
    verifyAvailability,
    clearAvailability,
  };
}
