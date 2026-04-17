import { useState, useCallback, useEffect } from 'react';
import { getHotelBookings } from '../services/api/bookings';
import { useServiceAdminLogic } from './useServiceAdminLogic';

export interface Booking {
  id: string;
  confirmationCode?: string;
  status?: string;
  paymentStatus?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhoneNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  totalPrice?: number;
  bookedAt?: string;
  roomDetails?: any[];
  hotel?: any;
  guest?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseCurrentBookingsFetchReturn {
  bookings: Booking[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function useCurrentBookingsFetch(limit = 20): UseCurrentBookingsFetchReturn {
  const { fetchProfile } = useServiceAdminLogic();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelId, setHotelId] = useState<string | null>(null);

  // Fetch bookings from API
  const fetchBookings = useCallback(async (hId: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const { data: responseData, pagination: responsePagination } = await getHotelBookings(hId, page, limit);
      setBookings(responseData);
      setPagination(responsePagination);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || 'Failed to load bookings';
      if (__DEV__) console.error('[useCurrentBookingsFetch] Error:', errorMsg);
      setError(errorMsg);
      setBookings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initialize: fetch profile and then bookings
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await fetchProfile();
        if (!mounted) return;
        const retrievedHotelId = profile?.serviceEntityId;
        if (!retrievedHotelId) {
          setError('No hotel assigned to your account');
          setLoading(false);
          return;
        }
        setHotelId(retrievedHotelId);
        await fetchBookings(retrievedHotelId, 1);
      } catch (e) {
        if (__DEV__) console.error('[useCurrentBookingsFetch] Initialize error:', e);
        if (mounted) {
          setError('Failed to initialize bookings');
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [fetchProfile, fetchBookings]);

  // Refetch when page changes
  useEffect(() => {
    if (hotelId && currentPage) {
      fetchBookings(hotelId, currentPage);
    }
  }, [currentPage, fetchBookings, hotelId]);

  const refetch = useCallback(async () => {
    if (hotelId) {
      await fetchBookings(hotelId, currentPage);
    }
  }, [hotelId, currentPage, fetchBookings]);

  return {
    bookings,
    pagination,
    loading,
    error,
    currentPage,
    setCurrentPage,
    refetch,
  };
}
