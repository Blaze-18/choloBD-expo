import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getApiInstance } from '../services/api/axiosClient';

export function useBookingLogic() {
  const auth = useSelector((s: RootState) => s.auth);
  const [submitting, setSubmitting] = useState(false);

  const [loadingBookings, setLoadingBookings] = useState(false);

  const submitBooking = async (bookingData: {
    hotelId: string;
    checkInDate: string;
    checkOutDate: string;
    selectedRoomsMap: Record<string, number>;
    guestName: string;
    guestEmail: string;
    guestPhoneNumber: string;
    paymentMethod?: string;
    specialRequests?: string;
  }) => {
    if (!bookingData.hotelId) {
      Alert.alert('Error', 'Hotel ID is required');
      return null;
    }
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      Alert.alert('Error', 'Please enter check-in and check-out dates');
      return null;
    }
    const anyRooms = Object.values(bookingData.selectedRoomsMap).some((v) => v > 0);
    if (!anyRooms) {
      Alert.alert('Error', 'Please select at least one room');
      return null;
    }

    setSubmitting(true);
    try {
      const api = getApiInstance();
      const userId = auth.user?.id;
      if (!userId) {
        Alert.alert('Authentication required', 'Please login to create a booking');
        return null;
      }
      const body = {
        hotelId: bookingData.hotelId,
        userId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        selectedRoomsMap: bookingData.selectedRoomsMap,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhoneNumber: bookingData.guestPhoneNumber,
        paymentMethod: bookingData.paymentMethod,
        specialRequests: bookingData.specialRequests,
      };
      const res = await api.post('/api/bookings/hotel-rooms', body);
      console.log('[Booking] booking created', res.data);
      Alert.alert('Success', 'Booking created: ' + (res.data.data?.confirmationCode || ''));
      return res.data.data;
    } catch (e: any) {
      console.error('[Booking] submitBooking error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to create booking');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleBooking = async (
    bookingData: {
      hotelId: string;
      checkInDate: string;
      checkOutDate: string;
      selectedRoomsMap: Record<string, number>;
      guestName: string;
      guestEmail: string;
      guestPhoneNumber: string;
    },
    onSuccess?: (data: any) => void
  ) => {
    const result = await submitBooking(bookingData);
    if (result && typeof onSuccess === 'function') {
      try {
        onSuccess(result);
      } catch (e) {
        console.warn('onSuccess callback failed', e);
      }
    }
    return result;
  };

  return {
    submitting,
    submitBooking,
    handleBooking,
    // booking retrieval helpers
    fetchUserBookings: useCallback(async (page = 1, limit = 20) => {
      setLoadingBookings(true);
      try {
        const api = getApiInstance();
        const userId = auth.user?.id;
        if (!userId) {
          console.warn('[useBookingLogic] fetchUserBookings: no authenticated user');
          return { data: [], pagination: { total: 0, page, limit, pages: 0 } };
        }
        const res = await api.get(`/api/bookings/hotel-rooms?userId=${userId}&page=${page}&limit=${limit}`);
        const payload = res.data?.data ?? {};
        return payload;
      } catch (e) {
        console.error('[useBookingLogic] fetchUserBookings error', e);
        throw e;
      } finally {
        setLoadingBookings(false);
      }
    }, [auth.user?.id]),
    fetchBookingDetails: useCallback(async (bookingId: string) => {
      try {
        const api = getApiInstance();
        const res = await api.get(`/api/bookings/hotel-rooms/${bookingId}`);
        return res.data?.data ?? null;
      } catch (e) {
        console.error('[useBookingLogic] fetchBookingDetails error', e);
        throw e;
      }
    }, []),
  };
}
