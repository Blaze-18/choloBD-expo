import { useState, useEffect } from 'react';
import { getTransports } from '@/services/api/transports';
import { Transport, TransportFilters } from '@/types/transports';
import { PaginatedList } from '@/utils/paginatedList';

/**
 * Hook to fetch transports with optional filters
 */
export function useFetchTransports(filters?: TransportFilters) {
  const [transports, setTransports] = useState<PaginatedList<Transport>>({
    results: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransports(filters);
        setTransports(data);
      } catch (err: any) {
        console.error('[useFetchTransports] Error:', err);
        setError(err?.message || 'Failed to fetch transports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filters?.locationId,
    filters?.divisionId,
    filters?.transportType,
    filters?.isActive,
    filters?.isVerified,
    filters?.search,
    filters?.name,
    filters?.page,
    filters?.limit,
  ]);

  return { transports, loading, error };
}
