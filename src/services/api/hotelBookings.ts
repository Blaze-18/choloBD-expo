/**
 * Hotel Booking Selection Utilities
 * Pure functions for fetching hotel booking data for trip segments
 */

import { getApiInstance } from './axiosClient';

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

export async function fetchUserHotelBookings(locationId?: string): Promise<HotelBookingInfo[]> {
  try {
    const api = getApiInstance();
    const res = await api.get('/api/hotel-bookings', {
      params: locationId ? { locationId } : {},
    });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export function filterBookingsByLocation(
  bookings: HotelBookingInfo[],
  locationId: string,
  locationName?: string
): HotelBookingInfo[] {
  if (!locationName) return [];
  return bookings.filter((b) => b.location.toLowerCase() === locationName.toLowerCase());
}

export function formatBookingForDisplay(booking: HotelBookingInfo): string {
  const statusIndicator = {
    PENDING: '⏳',
    CONFIRMED: '✅',
    COMPLETED: '✔️',
    CANCELLED: '❌',
  }[booking.status];
  return `${statusIndicator} ${booking.hotelName} (${booking.checkInDate}) - ₹${booking.totalPrice}`;
}
