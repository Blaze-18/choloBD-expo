/**
 * Guide Admin Logic Hook
 * Guide operator (SERVICE_ADMIN) logic for the own profile and incoming requests
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { getMyGuide, updateGuideAvailability } from '../services/api/guides';
import { getGuideBookings, updateGuideBookingStatus } from '../services/api/guideBookings';
import {
  Guide,
  GuideBooking,
  GuideBookingAction,
  UpdateGuideAvailabilityData,
} from '../types/guides';

/**
 * Aggregate figures shown on the guide operator dashboard
 */
export interface GuideEarningsSummary {
  pendingRequests: number;
  activeBookings: number;
  completedTours: number;
  paidEarnings: number;
  pendingEarnings: number;
}

/**
 * Derives the operator's headline numbers from the booking list
 */
export function summarizeGuideBookings(bookings: GuideBooking[]): GuideEarningsSummary {
  return bookings.reduce<GuideEarningsSummary>(
    (acc, booking) => {
      if (booking.status === 'PENDING') acc.pendingRequests += 1;
      if (booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED') acc.activeBookings += 1;
      if (booking.status === 'COMPLETED') acc.completedTours += 1;

      if (booking.paymentStatus === 'PAID') acc.paidEarnings += booking.totalPrice;
      else if (booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED') {
        acc.pendingEarnings += booking.totalPrice;
      }

      return acc;
    },
    { pendingRequests: 0, activeBookings: 0, completedTours: 0, paidEarnings: 0, pendingEarnings: 0 }
  );
}

/**
 * Guide operators may accept or decline while PENDING, and complete once CONFIRMED.
 */
export function availableGuideActions(booking: GuideBooking): GuideBookingAction[] {
  if (booking.status === 'PENDING') return ['accept', 'decline'];
  if (booking.status === 'CONFIRMED') return ['complete'];
  return [];
}

export function useGuideAdminLogic() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<GuideBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Loads the guide profile owned by the signed-in service admin
   */
  const fetchMyGuide = useCallback(async (): Promise<Guide | null> => {
    setGuideLoading(true);
    setGuideError(null);
    try {
      const data = await getMyGuide();
      setGuide(data);
      return data;
    } catch (error: any) {
      console.error('[useGuideAdminLogic] fetchMyGuide error:', error);
      setGuide(null);
      setGuideError(error?.message || 'No guide profile is linked to this account');
      return null;
    } finally {
      setGuideLoading(false);
    }
  }, []);

  /**
   * Loads booking requests addressed to a guide profile
   */
  const fetchGuideBookings = useCallback(async (guideId: string) => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const result = await getGuideBookings({ guideId, limit: 50 });
      setBookings(result.results);
    } catch (error: any) {
      console.error('[useGuideAdminLogic] fetchGuideBookings error:', error);
      setBookings([]);
      setBookingsError(error?.message || 'Failed to load booking requests');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  /**
   * Loads the profile and its bookings in one pass, for screen mount
   */
  const loadDashboard = useCallback(async () => {
    const myGuide = await fetchMyGuide();
    if (myGuide?.id) await fetchGuideBookings(myGuide.id);
  }, [fetchMyGuide, fetchGuideBookings]);

  /**
   * Applies an accept / decline / complete transition to a request
   */
  const handleBookingAction = useCallback(
    async (bookingId: string, action: GuideBookingAction, reason?: string): Promise<boolean> => {
      setActionLoading(true);
      try {
        const updated = await updateGuideBookingStatus(bookingId, { action, reason });
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        Alert.alert('Booking Updated', `The request is now ${updated.status}.`);
        return true;
      } catch (error: any) {
        console.error('[useGuideAdminLogic] handleBookingAction error:', error);
        Alert.alert('Action Failed', error?.message || 'Could not update this booking.');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  /**
   * Updates working days, hours and blocked dates on the operator's profile
   */
  const saveAvailability = useCallback(
    async (guideId: string, data: UpdateGuideAvailabilityData): Promise<boolean> => {
      setActionLoading(true);
      try {
        const updated = await updateGuideAvailability(guideId, data);
        setGuide((prev) => (prev ? { ...prev, ...updated } : updated));
        Alert.alert('Availability Saved', 'Your schedule has been updated.');
        return true;
      } catch (error: any) {
        console.error('[useGuideAdminLogic] saveAvailability error:', error);
        Alert.alert('Update Failed', error?.message || 'Could not save your availability.');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  return {
    // State
    guide,
    guideLoading,
    guideError,
    bookings,
    bookingsLoading,
    bookingsError,
    actionLoading,
    summary: summarizeGuideBookings(bookings),

    // Actions
    fetchMyGuide,
    fetchGuideBookings,
    loadDashboard,
    handleBookingAction,
    saveAvailability,
  };
}
