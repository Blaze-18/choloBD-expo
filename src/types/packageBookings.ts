/**
 * Package Booking Types
 * Type definitions for tour package bookings
 */

/**
 * Booking status enum (from backend API)
 */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED' | 'NO_SHOW';

/**
 * Payment status enum (from backend API)
 */
export type PaymentStatus = 'UNPAID' | 'PAID';

/**
 * Package booking interface (from GET response)
 */
export interface PackageBooking {
  id: string;
  tourPackageId: string;
  userId: string;
  bookingDate: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  confirmationCode: string;
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  tourPackage?: {
    id: string;
    packageName: string;
    shortDescription?: string;
    duration: number;
    totalBudget: number;
    location: {
      id: string;
      name: string;
    };
    isActive: boolean;
    isPopular: boolean;
  };
  user?: {
    id: string;
    userName: string;
    email: string;
  };
}

/**
 * Payload for creating a new package booking (POST request)
 */
export interface CreatePackageBookingData {
  quantity?: number; // Optional, defaults to 1
  specialRequests?: string;
  notes?: string;
}

/**
 * Payload for cancelling a booking (PUT request)
 */
export interface CancelPackageBookingData {
  reason?: string;
  notes?: string;
}

/**
 * Filters for listing package bookings
 */
export interface PackageBookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  limit?: number; // 1-100, default 10
  offset?: number; // Start position, default 0
  sortBy?: 'bookingDate' | 'totalPrice' | 'status' | 'paymentStatus';
  sortOrder?: 'asc' | 'desc'; // Default 'desc'
}

/**
 * API response wrapper for package booking endpoints
 */
export interface PackageBookingApiResponse<T> {
  status: 'success' | 'failed';
  message: string;
  data: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Package booking statistics (admin only)
 */
export interface PackageBookingStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  pendingRevenue: number;
  confirmedRevenue: number;
}

/**
 * Typed error response from backend
 */
export interface PackageBookingApiError {
  status: 'failed';
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Package booking error types
 */
export interface PackageBookingError {
  type: 'VALIDATION' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'CONFLICT' | 'SERVER' | 'UNKNOWN';
  statusCode: number;
  message: string;
  details?: Record<string, any>;
}
