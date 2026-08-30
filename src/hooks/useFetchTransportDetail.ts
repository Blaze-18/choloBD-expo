import { useState, useEffect } from 'react';
import { getTransportDetail } from '@/services/api/transports';
import { Transport } from '@/types/transports';

/**
 * Hook to fetch a single transport's details
 */
export function useFetchTransportDetail(transportId?: string) {
  const [transport, setTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transportId) {
      setTransport(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransportDetail(transportId);
        setTransport(data);
      } catch (err: any) {
        console.error('[useFetchTransportDetail] Error:', err);
        setError(err?.message || 'Failed to fetch transport details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transportId]);

  return { transport, loading, error };
}
