/**
 * Trip Planner API Client
 * Handles all HTTP calls to trip planner endpoints
 * Base URL: http://localhost:5000/api/trip-plans
 */

import { getApiInstance } from './axiosClient';
import {
  TripPlan,
  TripSummary,
  UserSegment,
  TripFilters,
  CreateTripData,
  UpdateTripData,
  CreateSegmentData,
  UpdateSegmentData,
  TripApiResponse,
  TripApiError,
  PaginationInfo,
} from '../../types/trips';
import { AxiosError } from 'axios';

/**
 * Helper to map HTTP errors to typed TripApiError
 */
function mapApiError(error: any): TripApiError {
  console.error('[tripPlanner.ts] Mapping API error:', error?.response?.status, error?.message);

  if (error?.response?.status === 400) {
    return {
      type: 'VALIDATION',
      statusCode: 400,
      message: error?.response?.data?.message || 'Validation failed. Check your input.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 401) {
    return {
      type: 'UNAUTHORIZED',
      statusCode: 401,
      message: error?.response?.data?.message || 'Unauthorized. Please login again.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 403) {
    return {
      type: 'FORBIDDEN',
      statusCode: 403,
      message: error?.response?.data?.message || 'Access denied. You do not own this trip.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 404) {
    return {
      type: 'NOT_FOUND',
      statusCode: 404,
      message: error?.response?.data?.message || 'Trip plan or segment not found.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 409) {
    return {
      type: 'CONFLICT',
      statusCode: 409,
      message:
        error?.response?.data?.message || 'Conflict: Cannot delete trip with confirmed bookings.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 500) {
    return {
      type: 'SERVER',
      statusCode: 500,
      message: 'Server error. Please try again later.',
      details: error?.response?.data?.details,
    };
  } else {
    return {
      type: 'UNKNOWN',
      statusCode: error?.response?.status || 0,
      message: error?.message || 'An unknown error occurred.',
      details: error?.response?.data?.details,
    };
  }
}

/**
 * POST /api/trip-plans
 * Create a new trip plan for the authenticated user
 */
export async function createTrip(payload: CreateTripData): Promise<TripPlan> {
  try {
    console.log('[tripPlanner.ts] ========== CREATE TRIP PLAN API CALL ==========');
    console.log('[tripPlanner.ts] Trip Name:', payload.name);
    console.log('[tripPlanner.ts] Endpoint: POST /api/trip-plans');
    console.log('[tripPlanner.ts] Request Payload:', JSON.stringify(payload, null, 2));

    const api = getApiInstance();
    console.log('[tripPlanner.ts] Sending POST request...');
    const res = await api.post<TripApiResponse<TripPlan>>('/api/trip-plans', payload);

    console.log('[tripPlanner.ts] ✅ API Response Status:', res.status);
    console.log('[tripPlanner.ts] Created Trip ID:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] ❌ API Error Status:', error?.response?.status);
    console.error('[tripPlanner.ts] Error Message:', error?.message);
    console.error('[tripPlanner.ts] Error Response Data:', error?.response?.data);
    throw mapApiError(error);
  }
}

/**
 * GET /api/trip-plans
 * Fetch all trips for authenticated user with optional filters and pagination
 */
export async function getTrips(
  filters?: TripFilters
): Promise<{ trips: TripPlan[]; pagination: PaginationInfo }> {
  try {
    console.log('[tripPlanner.ts] Fetching trips with filters:', filters);
    const api = getApiInstance();

    const params: any = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.locationId) params.locationId = filters.locationId;
    if (filters?.isPublic !== undefined) params.isPublic = filters.isPublic;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const res = await api.get<TripApiResponse<TripPlan[]>>('/api/trip-plans', { params });
    console.log('[tripPlanner.ts] getTrips success, count:', res.data.data?.length);

    return {
      trips: res.data.data || [],
      pagination: res.data.pagination || {
        total: res.data.data?.length || 0,
        page: 1,
        limit: 10,
        pages: 1,
      },
    };
  } catch (error: any) {
    console.error('[tripPlanner.ts] getTrips error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/trip-plans/:tripId
 * Fetch detailed information for a specific trip including all segments
 */
export async function getTripDetails(tripId: string): Promise<TripPlan> {
  try {
    console.log('[tripPlanner.ts] Fetching trip details:', tripId);
    const api = getApiInstance();
    const res = await api.get<TripApiResponse<TripPlan>>(`/api/trip-plans/${tripId}`);
    console.log('[tripPlanner.ts] getTripDetails success, segments count:', res.data.data?.userSegments?.length);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] getTripDetails error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/trip-plans/:tripId
 * Update an existing trip plan (name, budget, status, etc.)
 */
export async function updateTrip(tripId: string, payload: UpdateTripData): Promise<TripPlan> {
  try {
    console.log('[tripPlanner.ts] Updating trip:', tripId);
    console.log('[tripPlanner.ts] Update Payload:', JSON.stringify(payload, null, 2));
    const api = getApiInstance();
    const res = await api.put<TripApiResponse<TripPlan>>(`/api/trip-plans/${tripId}`, payload);
    console.log('[tripPlanner.ts] updateTrip success, id:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] updateTrip error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * DELETE /api/trip-plans/:tripId
 * Delete a trip plan (only if no confirmed bookings)
 */
export async function deleteTrip(tripId: string): Promise<{ success: boolean }> {
  try {
    console.log('[tripPlanner.ts] Deleting trip:', tripId);
    const api = getApiInstance();
    await api.delete(`/api/trip-plans/${tripId}`);
    console.log('[tripPlanner.ts] deleteTrip success');
    return { success: true };
  } catch (error: any) {
    console.error('[tripPlanner.ts] deleteTrip error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * POST /api/trip-plans/:tripId/segments
 * Add a new segment (activity, accommodation, transport) to a specific day
 */
export async function addSegment(tripId: string, payload: CreateSegmentData): Promise<UserSegment> {
  try {
    console.log('[tripPlanner.ts] Adding segment to trip:', tripId);
    console.log('[tripPlanner.ts] Segment Payload:', JSON.stringify(payload, null, 2));
    const api = getApiInstance();
    const res = await api.post<TripApiResponse<UserSegment>>(
      `/api/trip-plans/${tripId}/segments`,
      payload
    );
    console.log('[tripPlanner.ts] addSegment success, segment id:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] addSegment error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/trip-plans/:tripId/segments/:segmentId
 * Update an existing segment (add bookings, notes, timings, etc.)
 */
export async function updateSegment(
  tripId: string,
  segmentId: string,
  payload: UpdateSegmentData
): Promise<UserSegment> {
  try {
    console.log('[tripPlanner.ts] Updating segment:', segmentId, 'for trip:', tripId);
    console.log('[tripPlanner.ts] Update Payload:', JSON.stringify(payload, null, 2));
    const api = getApiInstance();
    const res = await api.put<TripApiResponse<UserSegment>>(
      `/api/trip-plans/${tripId}/segments/${segmentId}`,
      payload
    );
    console.log('[tripPlanner.ts] updateSegment success, segment id:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] updateSegment error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * DELETE /api/trip-plans/:tripId/segments/:segmentId
 * Remove a segment from a trip
 */
export async function deleteSegment(tripId: string, segmentId: string): Promise<{ success: boolean }> {
  try {
    console.log('[tripPlanner.ts] Deleting segment:', segmentId, 'from trip:', tripId);
    const api = getApiInstance();
    await api.delete(`/api/trip-plans/${tripId}/segments/${segmentId}`);
    console.log('[tripPlanner.ts] deleteSegment success');
    return { success: true };
  } catch (error: any) {
    console.error('[tripPlanner.ts] deleteSegment error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/trip-plans/:tripId/segments/day/:dayNumber
 * Fetch all segments for a specific day
 */
export async function getDaySegments(tripId: string, dayNumber: number): Promise<UserSegment[]> {
  try {
    console.log('[tripPlanner.ts] Fetching segments for day:', dayNumber, 'trip:', tripId);
    const api = getApiInstance();
    const res = await api.get<TripApiResponse<UserSegment[]>>(
      `/api/trip-plans/${tripId}/segments/day/${dayNumber}`
    );
    console.log('[tripPlanner.ts] getDaySegments success, count:', res.data.data?.length);
    return res.data.data || [];
  } catch (error: any) {
    console.error('[tripPlanner.ts] getDaySegments error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/trip-plans/:tripId/summary
 * Fetch cost breakdown and booking summary for a trip
 */
export async function getTripSummary(tripId: string): Promise<TripSummary> {
  try {
    console.log('[tripPlanner.ts] Fetching trip summary:', tripId);
    const api = getApiInstance();
    const res = await api.get<TripApiResponse<TripSummary>>(`/api/trip-plans/${tripId}/summary`);
    console.log('[tripPlanner.ts] getTripSummary success');
    console.log('[tripPlanner.ts] Total estimated cost:', res.data.data?.totalEstimatedCost);
    console.log('[tripPlanner.ts] Budget status:', res.data.data?.budgetStatus);
    return res.data.data;
  } catch (error: any) {
    console.error('[tripPlanner.ts] getTripSummary error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

console.log('[tripPlanner.ts] Trip Planner API client module loaded');
