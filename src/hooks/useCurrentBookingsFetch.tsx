import { useState, useCallback, useEffect } from 'react';
import { getApiInstance } from '../services/api/axiosClient';
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
      
      const api = getApiInstance();
      console.log('[useCurrentBookingsFetch] Fetching bookings with params:', { hotelId: hId, page, limit });
      
      const res = await api.get('/api/bookings/hotel-rooms', {
        params: { 
          hotelId: hId, 
          page, 
          limit,
        },
      });

      console.log('[useCurrentBookingsFetch] API Response:', {
        status: res.status,
        fullData: res.data,
        dataField: res.data?.data,
        pagination: res.data?.pagination,
      });

      // Parse response - server returns { status, message, data: { data: [...], pagination: {...} } }
      // So we need res.data.data.data for bookings and res.data.data.pagination for pagination
      const responseData = res.data?.data?.data || [];
      const responsePagination = res.data?.data?.pagination || null;

      console.log('[useCurrentBookingsFetch] Parsed data:', {
        bookingsCount: Array.isArray(responseData) ? responseData.length : 0,
        bookings: responseData,
        pagination: responsePagination,
      });

      setBookings(Array.isArray(responseData) ? responseData : []);
      setPagination(responsePagination);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || 'Failed to load bookings';
      console.error('[useCurrentBookingsFetch] Error:', {
        message: errorMsg,
        status: e?.response?.status,
        data: e?.response?.data,
        fullError: e,
      });
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

        console.log('[useCurrentBookingsFetch] Initializing...');

        const profile = await fetchProfile();
        console.log('[useCurrentBookingsFetch] Profile fetched:', profile);

        if (!mounted) return;

        const retrievedHotelId = profile?.serviceEntityId;
        console.log('[useCurrentBookingsFetch] Retrieved hotelId:', retrievedHotelId);

        if (!retrievedHotelId) {
          setError('No hotel assigned to your account');
          setLoading(false);
          return;
        }

        setHotelId(retrievedHotelId);
        await fetchBookings(retrievedHotelId, 1);
      } catch (e) {
        console.error('[useCurrentBookingsFetch] Initialize error:', e);
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
