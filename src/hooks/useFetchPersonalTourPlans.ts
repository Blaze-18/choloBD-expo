import { useCallback, useEffect, useState } from 'react';
import { getPersonalTourPlans } from '../services/api/tourBuilder';
import { PersonalTourPlanFilters, TourPackage } from '../types/tours';

export function useFetchPersonalTourPlans(filters?: PersonalTourPlanFilters) {
  const [plans, setPlans] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const filterKey = JSON.stringify(filters ?? {});

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPersonalTourPlans(filters);
        if (active) setPlans(data);
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Failed to fetch personal tour plans');
          setPlans([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filterKey, reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return { plans, isLoading, error, refetch };
}
