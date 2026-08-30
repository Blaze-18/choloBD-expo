import { useState, useEffect } from 'react';
import { getActivityBookings } from '@/services/api/activityBookings';
import { ActivityBooking, GetActivityBookingsParams } from '@/types/activityBookings';
import { PaginatedList } from '@/utils/paginatedList';

/**
 * Hook to fetch activity bookings with optional filters
 */
export function useFetchActivityBookings(params?: GetActivityBookingsParams) {
  const [bookings, setBookings] = useState<PaginatedList<ActivityBooking>>({
    results: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have at least one filter parameter
    if (!params?.userId && !params?.activitySpotId && !params?.confirmationCode) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActivityBookings(params);
        setBookings(data);
      } catch (err: any) {
        console.error('[useFetchActivityBookings] Error:', err);
        setError(err?.message || 'Failed to fetch activity bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    params?.userId,
    params?.activitySpotId,
    params?.status,
    params?.paymentStatus,
    params?.confirmationCode,
    params?.dateFrom,
    params?.dateTo,
    params?.page,
    params?.limit,
  ]);

  return { bookings, loading, error };
}
