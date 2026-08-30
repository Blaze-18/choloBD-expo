import { getApiInstance } from './axiosClient';
import {
  ActivityBooking,
  GetActivityBookingsParams,
  CreateActivityBookingData,
  UpdateActivityBookingData,
  GenerateActivityBookingQrResult,
  ValidateActivityBookingQrInput,
} from '@/types/activityBookings';
import { unwrapListData, PaginatedList } from '@/utils/paginatedList';

/**
 * Build query parameters for activity bookings
 */
function buildActivityBookingParams(params?: GetActivityBookingsParams): Record<string, string> {
  const queryParams: Record<string, string> = {};

  if (!params) return queryParams;

  if (params.userId) queryParams.userId = params.userId;
  if (params.activitySpotId) queryParams.activitySpotId = params.activitySpotId;
  if (params.status) queryParams.status = params.status;
  if (params.paymentStatus) queryParams.paymentStatus = params.paymentStatus;
  if (params.confirmationCode) queryParams.confirmationCode = params.confirmationCode;
  if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
  if (params.dateTo) queryParams.dateTo = params.dateTo;
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);

  return queryParams;
}

/**
 * Get activity bookings with optional filters
 */
export async function getActivityBookings(
  params?: GetActivityBookingsParams
): Promise<PaginatedList<ActivityBooking>> {
  const queryParams = buildActivityBookingParams(params);
  const res = await getApiInstance().get('/api/bookings/activity-spots', { params: queryParams });
  return unwrapListData<ActivityBooking>(res.data.data);
}

/**
 * Get a specific activity booking by ID
 */
export async function getActivityBookingDetail(bookingId: string): Promise<ActivityBooking> {
  const res = await getApiInstance().get(`/api/bookings/activity-spots/${bookingId}`);
  return res.data.data;
}

/**
 * Create a new activity booking
 */
export async function createActivityBooking(
  bookingData: CreateActivityBookingData
): Promise<ActivityBooking> {
  const res = await getApiInstance().post('/api/bookings/activity-spots', bookingData);
  return res.data.data;
}

/**
 * Update an existing activity booking
 */
export async function updateActivityBooking(
  bookingId: string,
  updateData: UpdateActivityBookingData
): Promise<ActivityBooking> {
  const res = await getApiInstance().put(`/api/bookings/activity-spots/${bookingId}`, updateData);
  return res.data.data;
}

/**
 * Generate QR token for activity booking
 */
export async function generateActivityBookingQr(
  bookingId: string
): Promise<GenerateActivityBookingQrResult> {
  const res = await getApiInstance().post(`/api/bookings/activity-spots/${bookingId}/qr-generate`);
  return res.data.data;
}

/**
 * Validate activity booking QR token
 */
export async function validateActivityBookingQr(
  data: ValidateActivityBookingQrInput
): Promise<{ booking: ActivityBooking }> {
  const res = await getApiInstance().post('/api/bookings/activity-spots/qr-scan', data);
  return res.data.data;
}

/**
 * Cancel an activity booking
 */
export async function cancelActivityBooking(
  bookingId: string,
  reason?: string
): Promise<{ message: string }> {
  const res = await getApiInstance().delete(`/api/bookings/activity-spots/${bookingId}`, {
    data: reason ? { reason } : undefined,
  });
  return res.data.data;
}
