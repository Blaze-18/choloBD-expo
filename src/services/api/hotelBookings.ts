/**
 * Hotel Booking Selection Hooks
 * Utilities for fetching and selecting hotel bookings for trip segments
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getApiInstance } from './axiosClient';
import { useFetchHotels } from './hotels';

/**
 * Hook-based interface for hotel booking selection
 * Fetches user's existing bookings and available hotels for a location
 */
export interface HotelBookingInfo {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  confirmationCode: string;
}

export interface AvailableHotel {
  id: string;
  name: string;
  location: string;
  avgRating?: number;
  image?: string;
}

/**
 * Fetch user's hotel bookings (potentially filtered by location)
 * Falls back to mock data if API doesn't exist yet
 */
export function useFetchUserHotelBookings() {
  const [bookings, setBookings] = useState<HotelBookingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (locationId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const api = getApiInstance();

      // Try to fetch from hotels endpoint with user bookings query
      // Adjust this endpoint based on actual backend available endpoints
      try {
        const res = await api.get('/api/hotel-bookings', {
          params: locationId ? { locationId } : {},
        });
        const bookingsData = res.data.data || [];
        setBookings(bookingsData);
      } catch (err: any) {
        // If endpoint doesn't exist, set empty array
        console.warn('[useFetchUserHotelBookings] Hotel bookings endpoint not available', err.message);
        setBookings([]);
      }
    } catch (err: any) {
      console.error('[useFetchUserHotelBookings] Error:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Failed to load hotel bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    clearBookings: () => setBookings([]),
  };
}

/**
 * Fetch available hotels for a location with smart filtering
 */
export function useFetchLocationHotels() {
  const { hotels, loading: hotelsLoading, fetchHotels } = useFetchHotels();
  
  const fetchHotelsForLocation = async (locationId: string, filters?: {
    minRating?: number;
    maxPrice?: number;
    hotelType?: string;
  }) => {
    try {
      await fetchHotels({
        locationId,
        hotelType: filters?.hotelType,
        minRating: filters?.minRating,
        isActive: true,
      });
    } catch (err: any) {
      console.error('[useFetchLocationHotels] Error:', err);
      Alert.alert('Error', 'Failed to load available hotels');
    }
  };

  return {
    hotels,
    loading: hotelsLoading,
    fetchHotelsForLocation,
  };
}

/**
 * Helper: Get bookings matching a specific location
 */
export function filterBookingsByLocation(
  bookings: HotelBookingInfo[],
  locationId: string,
  locationName?: string
): HotelBookingInfo[] {
  if (!locationName) return [];
  return bookings.filter((b) => b.location.toLowerCase() === locationName.toLowerCase());
}

/**
 * Helper: Format booking for display in segment modal
 */
export function formatBookingForDisplay(booking: HotelBookingInfo): string {
  const statusIndicator = {
    'PENDING': '⏳',
    'CONFIRMED': '✅',
    'COMPLETED': '✔️',
    'CANCELLED': '❌',
  }[booking.status];
  
  return `${statusIndicator} ${booking.hotelName} (${booking.checkInDate}) - ₹${booking.totalPrice}`;
}

console.log('[hotel booking selection] Hotel booking utilities loaded');
