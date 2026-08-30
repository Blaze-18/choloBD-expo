/**
 * Guide Booking Logic Hook
 * Traveler-side business logic for requesting, paying for and cancelling guides
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  createGuideBooking,
  getGuideBookingById,
  getGuideBookings,
  updateGuideBookingStatus,
} from '../services/api/guideBookings';
import { usePaymentLogic } from './usePaymentLogic';
import { GuideBooking, GuideBookingFilters } from '../types/guides';

/**
 * Payload accepted by `submitBooking`. `userId` is filled in from auth state.
 */
export interface SubmitGuideBookingInput {
  guideId: string;
  bookingDate: string;
  endTime: string;
  travelerCount: number;
  startTime?: string;
  specialRequirements?: string;
  specialRequests?: string;
  paymentMethod?: 'wallet' | 'sslcommerz' | 'cash';
}

/**
 * A traveler may pay only once the guide has accepted and the 24h window is open.
 */
export function canPayForGuideBooking(booking: GuideBooking): boolean {
  if (booking.status !== 'ACCEPTED' || booking.paymentStatus !== 'UNPAID') return false;
  if (!booking.paymentExpiresAt) return true;
  return new Date(booking.paymentExpiresAt).getTime() > Date.now();
}

/**
 * A traveler may cancel while the request is still PENDING or ACCEPTED and unpaid.
 */
export function canCancelGuideBooking(booking: GuideBooking): boolean {
  return (
    (booking.status === 'PENDING' || booking.status === 'ACCEPTED') &&
    booking.paymentStatus === 'UNPAID'
  );
}

export function useGuideBookingLogic() {
  const auth = useSelector((state: RootState) => state.auth);
  const { startPayment, isLoading: paymentLoading } = usePaymentLogic();

  const [bookings, setBookings] = useState<GuideBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [currentBooking, setCurrentBooking] = useState<GuideBooking | null>(null);
  const [currentBookingLoading, setCurrentBookingLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  /**
   * Creates a guide request for the signed-in traveler
   */
  const submitBooking = useCallback(
    async (input: SubmitGuideBookingInput): Promise<GuideBooking | null> => {
      const userId = auth.user?.id;
      if (!userId) {
        Alert.alert('Authentication Required', 'Please login to request a guide');
        return null;
      }

      setSubmitting(true);
      try {
        const booking = await createGuideBooking({ ...input, userId });
        if (__DEV__) console.log('[useGuideBookingLogic] Booking created:', booking.confirmationCode);
        return booking;
      } catch (error: any) {
        console.error('[useGuideBookingLogic] submitBooking error:', error);
        Alert.alert('Request Failed', error?.message || 'Failed to request this guide. Please try again.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [auth.user?.id]
  );

  /**
   * Loads the signed-in traveler's guide bookings
   */
  const fetchMyBookings = useCallback(
    async (filters?: Omit<GuideBookingFilters, 'userId'>) => {
      const userId = auth.user?.id;
      if (!userId) {
        setBookings([]);
        setBookingsError('Please login to view your guide bookings');
        return;
      }

      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const result = await getGuideBookings({ ...filters, userId });
        setBookings(result.results);
      } catch (error: any) {
        console.error('[useGuideBookingLogic] fetchMyBookings error:', error);
        setBookings([]);
        setBookingsError(error?.message || 'Failed to load your guide bookings');
      } finally {
        setBookingsLoading(false);
      }
    },
    [auth.user?.id]
  );

  /**
   * Loads a single booking detail
   */
  const fetchBookingDetail = useCallback(async (bookingId: string): Promise<GuideBooking | null> => {
    setCurrentBookingLoading(true);
    try {
      const booking = await getGuideBookingById(bookingId);
      setCurrentBooking(booking);
      return booking;
    } catch (error: any) {
      console.error('[useGuideBookingLogic] fetchBookingDetail error:', error);
      Alert.alert('Error', error?.message || 'Failed to load booking details');
      return null;
    } finally {
      setCurrentBookingLoading(false);
    }
  }, []);

  /**
   * Cancels a PENDING or ACCEPTED booking
   */
  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string, onSuccess?: () => void): Promise<boolean> => {
      setCancelling(true);
      try {
        const updated = await updateGuideBookingStatus(bookingId, { action: 'cancel', reason });
        setCurrentBooking(updated);
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        Alert.alert('Booking Cancelled', 'Your guide booking has been cancelled.');
        onSuccess?.();
        return true;
      } catch (error: any) {
        console.error('[useGuideBookingLogic] cancelBooking error:', error);
        Alert.alert('Cancellation Failed', error?.message || 'Failed to cancel this booking.');
        return false;
      } finally {
        setCancelling(false);
      }
    },
    []
  );

  /**
   * Opens the SSLCommerz gateway for an accepted booking and refreshes it afterwards
   */
  const payForBooking = useCallback(
    async (booking: GuideBooking, onSuccess?: () => void): Promise<boolean> => {
      if (!canPayForGuideBooking(booking)) {
        Alert.alert('Payment Unavailable', 'This booking is not awaiting payment right now.');
        return false;
      }

      const result = await startPayment({
        serviceType: 'GUIDE_SERVICE',
        serviceTypeId: booking.id,
        paymentAmount: booking.totalPrice,
        email: auth.user?.email,
        userName: auth.user?.userName,
      });

      if (result.success) {
        Alert.alert('Payment Successful', 'Your guide booking is confirmed.');
        await fetchBookingDetail(booking.id);
        onSuccess?.();
        return true;
      }

      Alert.alert('Payment Incomplete', result.error || 'The payment was not completed.');
      return false;
    },
    [startPayment, auth.user?.email, auth.user?.userName, fetchBookingDetail]
  );

  return {
    // State
    bookings,
    bookingsLoading,
    bookingsError,
    currentBooking,
    currentBookingLoading,
    submitting,
    cancelling,
    paymentLoading,

    // Actions
    submitBooking,
    fetchMyBookings,
    fetchBookingDetail,
    cancelBooking,
    payForBooking,
  };
}
