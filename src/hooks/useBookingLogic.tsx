import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createBooking, getUserBookings, getBookingById } from '../services/api/bookings';

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
      const userId = auth.user?.id;
      if (!userId) {
        Alert.alert('Authentication required', 'Please login to create a booking');
        return null;
      }
      const result = await createBooking({ ...bookingData, userId });
      Alert.alert('Success', 'Booking created: ' + (result?.confirmationCode || ''));
      return result;
    } catch (e: any) {
      if (__DEV__) console.error('[useBookingLogic] submitBooking error', e?.response?.data || e.message);
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
      paymentMethod?: string;
      specialRequests?: string;
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
        const userId = auth.user?.id;
        if (!userId) {
          return { data: [], pagination: { total: 0, page, limit, pages: 0 } };
        }
        return await getUserBookings(userId, page, limit);
      } catch (e) {
        if (__DEV__) console.error('[useBookingLogic] fetchUserBookings error', e);
        throw e;
      } finally {
        setLoadingBookings(false);
      }
    }, [auth.user?.id]),
    fetchBookingDetails: useCallback(async (bookingId: string) => {
      try {
        return await getBookingById(bookingId);
      } catch (e) {
        if (__DEV__) console.error('[useBookingLogic] fetchBookingDetails error', e);
        throw e;
      }
    }, []),
  };
}
