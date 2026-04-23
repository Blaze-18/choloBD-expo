/**
 * Fetch User Hotel Bookings Hook
 * Fetches user's existing hotel bookings for a specific trip location
 * Uses the existing /api/bookings/hotel-rooms endpoint via getUserBookings
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getUserBookings } from '../services/api/bookings';
import { HotelBookingInfo } from '../services/api/hotelBookings';
import { TripPlan } from '../types/trips';

export function useFetchUserHotelBookings(trip: TripPlan | null) {
  const [bookings, setBookings] = useState<HotelBookingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Get userId from Redux auth state
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!trip?.primaryLocationId || !trip?.primaryLocation?.name || !userId) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        if (__DEV__) {
          console.log('[useFetchUserHotelBookings] Fetching bookings for userId:', userId);
        }

        // Fetch user's hotel bookings using existing endpoint
        const response = await getUserBookings(userId, 1, 100);
        const rawBookings = response.data || [];

        if (__DEV__) {
          console.log('[useFetchUserHotelBookings] Raw bookings received:', rawBookings.length);
        }

        // Map response to HotelBookingInfo interface
        // The backend returns booking data - we need to match location and format
        const mappedBookings: HotelBookingInfo[] = rawBookings
          .map((booking: any) => ({
            id: booking.id,
            hotelId: booking.hotelId,
            hotelName: booking.hotel?.name || booking.hotelName || 'Unknown Hotel',
            location: booking.hotel?.location?.name || booking.location || '',
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            status: booking.status || 'PENDING',
            totalPrice: booking.totalPrice || 0,
            confirmationCode: booking.confirmationCode || '',
          }))
          .filter((booking: HotelBookingInfo) => booking.hotelName && booking.checkInDate && booking.checkOutDate);

        // Filter bookings by location name match (case-insensitive)
        const filteredBookings = mappedBookings.filter((booking) =>
          booking.location.toLowerCase() === trip.primaryLocation.name.toLowerCase()
        );

        if (__DEV__) {
          console.log('[useFetchUserHotelBookings] Filtered bookings for location', trip.primaryLocation.name, ':', filteredBookings.length);
        }

        // Sort by check-in date (most recent first)
        filteredBookings.sort(
          (a, b) =>
            new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
        );

        setBookings(filteredBookings);
      } catch (error: any) {
        if (__DEV__) {
          console.error('[useFetchUserHotelBookings] error:', error?.response?.data || error.message);
        }
        // Silently fail - not critical if bookings don't load
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [trip?.primaryLocationId, trip?.primaryLocation?.name, userId]);

  /**
   * Get applicable day numbers for a booking
   * Returns day numbers (1-indexed) where the booking overlaps with trip dates
   */
  const getApplicableDayNumbers = (booking: HotelBookingInfo): number[] => {
    if (!trip) return [];

    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const bookingStart = new Date(booking.checkInDate);
    const bookingEnd = new Date(booking.checkOutDate);

    // If booking is completely outside trip range, return empty
    if (bookingEnd < tripStart || bookingStart > tripEnd) {
      return [];
    }

    // Calculate overlap
    const overlapStart = Math.max(tripStart.getTime(), bookingStart.getTime());
    const overlapEnd = Math.min(tripEnd.getTime(), bookingEnd.getTime());

    const dayNumbers: number[] = [];
    const currentDate = new Date(overlapStart);

    while (currentDate <= new Date(overlapEnd)) {
      // Calculate day number (1-indexed from trip start)
      const dayNum = Math.ceil(
        (currentDate.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      if (dayNum > 0) {
        dayNumbers.push(dayNum);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dayNumbers;
  };

  /**
   * Format booking for display in UI
   */
  const formatBooking = (booking: HotelBookingInfo) => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const dates = `${checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    
    return {
      ...booking,
      dateRange: dates,
      applicableDays: getApplicableDayNumbers(booking),
    };
  };

  return {
    bookings: bookings.map(formatBooking),
    loading,
    getApplicableDayNumbers,
  };
}
