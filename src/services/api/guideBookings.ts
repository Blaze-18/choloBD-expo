/**
 * Guide Booking API Client
 * Handles all HTTP calls to the /api/bookings/guides endpoints
 */

import { getApiInstance } from './axiosClient';
import {
  CreateGuideBookingData,
  GuideApiResponse,
  GuideBooking,
  GuideBookingFilters,
  GuideError,
  GuidePaginatedResult,
  UpdateGuideBookingStatusData,
} from '../../types/guides';

/**
 * Helper to map HTTP errors to a typed GuideError
 */
function mapApiError(error: any): GuideError {
  console.error('[guideBookings.ts] Mapping API error:', error?.response?.status, error?.message);

  const message = error?.response?.data?.message;
  const details = error?.response?.data?.details;

  switch (error?.response?.status) {
    case 400:
      return { type: 'VALIDATION', statusCode: 400, message: message || 'Validation failed. Check your input.', details };
    case 401:
      return { type: 'UNAUTHORIZED', statusCode: 401, message: message || 'Authentication required.', details };
    case 403:
      return { type: 'FORBIDDEN', statusCode: 403, message: message || 'You do not have permission to do that.', details };
    case 404:
      return { type: 'NOT_FOUND', statusCode: 404, message: message || 'Booking not found.', details };
    case 409:
      return { type: 'CONFLICT', statusCode: 409, message: message || 'Conflict: cannot perform this action.', details };
    case 500:
      return { type: 'SERVER', statusCode: 500, message: 'Server error. Please try again later.', details };
    default:
      return { type: 'UNKNOWN', statusCode: error?.response?.status || 0, message: error?.message || 'An unknown error occurred.', details };
  }
}

/**
 * GET /api/bookings/guides
 * Always paginated. The backend derives access from the filters: `userId` must
 * be the caller, `guideId` must be a guide the caller operates, and an
 * unfiltered call is MASTER_ADMIN only.
 * @param filters - Ownership, status and pagination filters
 * @returns Bookings plus pagination metadata
 */
export async function getGuideBookings(
  filters?: GuideBookingFilters
): Promise<GuidePaginatedResult<GuideBooking>> {
  try {
    const api = getApiInstance();

    const params: Record<string, any> = {};
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.guideId) params.guideId = filters.guideId;
    if (filters?.status) params.status = filters.status;
    if (filters?.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters?.confirmationCode) params.confirmationCode = filters.confirmationCode;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;
    params.page = filters?.page ?? 1;
    params.limit = filters?.limit ?? 20;

    const res = await api.get<GuideApiResponse<GuidePaginatedResult<GuideBooking>>>(
      '/api/bookings/guides',
      { params }
    );

    const data = res.data.data;
    console.log('[guideBookings.ts] getGuideBookings success, count:', data?.results?.length);
    return {
      results: data?.results ?? [],
      total: data?.total ?? 0,
      page: data?.page ?? params.page,
      limit: data?.limit ?? params.limit,
    };
  } catch (error: any) {
    console.error('[guideBookings.ts] getGuideBookings error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * POST /api/bookings/guides
 * Creates a guide request. The booking starts as PENDING/UNPAID and payment
 * only opens once the guide accepts.
 * @param data - Guide, traveler, schedule and party size
 * @returns Created booking with its GD- confirmation code
 */
export async function createGuideBooking(data: CreateGuideBookingData): Promise<GuideBooking> {
  try {
    console.log('[guideBookings.ts] Creating guide booking for guide:', data.guideId);
    const api = getApiInstance();

    const res = await api.post<GuideApiResponse<GuideBooking>>('/api/bookings/guides', data);

    console.log('[guideBookings.ts] Create success, confirmationCode:', res.data.data?.confirmationCode);
    return res.data.data;
  } catch (error: any) {
    console.error('[guideBookings.ts] createGuideBooking error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/bookings/guides/:bookingId
 * Single booking with the guide and traveler populated.
 * @param bookingId - Booking UUID
 * @returns Guide booking detail
 */
export async function getGuideBookingById(bookingId: string): Promise<GuideBooking> {
  try {
    const api = getApiInstance();
    const res = await api.get<GuideApiResponse<GuideBooking>>(`/api/bookings/guides/${bookingId}`);
    console.log('[guideBookings.ts] getGuideBookingById success:', bookingId);
    return res.data.data;
  } catch (error: any) {
    console.error('[guideBookings.ts] getGuideBookingById error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PATCH /api/bookings/guides/:bookingId/status
 * Transitions a booking. `accept`, `decline` and `complete` are guide-operator
 * actions; `cancel` is available to the traveler while PENDING or ACCEPTED.
 * @param bookingId - Booking UUID
 * @param data - Action plus an optional reason
 * @returns Updated booking
 */
export async function updateGuideBookingStatus(
  bookingId: string,
  data: UpdateGuideBookingStatusData
): Promise<GuideBooking> {
  try {
    console.log('[guideBookings.ts] Updating booking status:', bookingId, data.action);
    const api = getApiInstance();

    const res = await api.patch<GuideApiResponse<GuideBooking>>(
      `/api/bookings/guides/${bookingId}/status`,
      data
    );

    console.log('[guideBookings.ts] Status update success:', res.data.data?.status);
    return res.data.data;
  } catch (error: any) {
    console.error('[guideBookings.ts] updateGuideBookingStatus error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}
