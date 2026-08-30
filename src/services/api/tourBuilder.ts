/**
 * Tour Builder API Client
 * Handles all HTTP calls to tour builder endpoints
 */

import { getApiInstance } from './axiosClient';
import {
  TourPackage,
  TourFilters,
  CreateTourPlanData,
  UpdateTourPlanData,
  CreatePersonalTourPlanData,
  UpdatePersonalTourPlanData,
  PersonalTourPlanFilters,
  TourApiResponse,
  TourApiError,
} from '../../types/tours';
import { unwrapListData } from '../../utils/paginatedList';

function buildTourListParams(filters?: TourFilters): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  if (!filters) return params;
  if (filters.locationId) params.locationId = filters.locationId;
  if (filters.divisionId) params.divisionId = filters.divisionId;
  if (filters.tourSpotId) params.tourSpotId = filters.tourSpotId;
  if (filters.tourType) params.tourType = filters.tourType;
  if (filters.isActive !== undefined) params.isActive = filters.isActive;
  if (filters.isPopular !== undefined) params.isPopular = filters.isPopular;
  if (filters.minBudget !== undefined) params.minBudget = filters.minBudget;
  if (filters.maxBudget !== undefined) params.maxBudget = filters.maxBudget;
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  return params;
}

/**
 * Helper to map HTTP errors to typed TourApiError
 */
function mapApiError(error: any): TourApiError {
  console.error('[tourBuilder.ts] Mapping API error:', error?.response?.status, error?.message);

  if (error?.response?.status === 400) {
    return {
      type: 'VALIDATION',
      statusCode: 400,
      message: error?.response?.data?.message || 'Validation failed. Check your input.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 404) {
    return {
      type: 'NOT_FOUND',
      statusCode: 404,
      message: error?.response?.data?.message || 'Tour package or location not found.',
      details: error?.response?.data?.details,
    };
  } else if (error?.response?.status === 409) {
    return {
      type: 'CONFLICT',
      statusCode: 409,
      message: error?.response?.data?.message || 'Conflict: tour may already exist or is in use by bookings.',
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
 * GET /api/tour-builder/by-admin/:adminId
 * Fetch tour packages created by a specific admin
 * Use "me" for current authenticated admin, or provide specific adminId
 */
export async function getTourPlansByAdmin(adminId: string = 'me', filters?: TourFilters): Promise<TourPackage[]> {
  try {
    console.log('[tourBuilder.ts] Fetching tour plans by admin:', adminId, 'filters:', filters);
    const api = getApiInstance();

    const params = buildTourListParams(filters);

    const res = await api.get<TourApiResponse<TourPackage[] | { results?: TourPackage[] }>>(
      `/api/tour-builder/by-admin/${adminId}`,
      { params }
    );
    const list = unwrapListData<TourPackage>(res.data.data).results;
    console.log('[tourBuilder.ts] getTourPlansByAdmin success, count:', list.length);
    return list;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getTourPlansByAdmin error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/tour-builder
 * Fetch list of tour packages with optional filters
 */
export async function getTourPlans(filters?: TourFilters): Promise<TourPackage[]> {
  try {
    console.log('[tourBuilder.ts] Fetching tour plans with filters:', filters);
    const api = getApiInstance();

    const params = buildTourListParams({
      limit: 100,
      ...filters,
    });

    const res = await api.get<TourApiResponse<TourPackage[] | { results?: TourPackage[] }>>(
      '/api/tour-builder',
      { params }
    );
    const list = unwrapListData<TourPackage>(res.data.data, filters?.page, filters?.limit).results;
    console.log('[tourBuilder.ts] getTourPlans success, count:', list.length);
    return list;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getTourPlans error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/tour-builder/:tourPackageId
 * Fetch a single tour package with enriched day segments
 */
export async function getTourPlan(tourPackageId: string): Promise<TourPackage> {
  try {
    console.log('[tourBuilder.ts] Fetching tour plan:', tourPackageId);
    const api = getApiInstance();
    const res = await api.get<TourApiResponse<TourPackage>>(`/api/tour-builder/${tourPackageId}`);
    console.log('[tourBuilder.ts] getTourPlan success, segments count:', res.data.data?.daySegments?.length);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * POST /api/tour-builder
 * Create a new tour package (admin only)
 */
export async function createTourPlan(payload: CreateTourPlanData): Promise<TourPackage> {
  try {
    console.log('[tourBuilder.ts] ========== CREATE TOUR PLAN API CALL ==========');
    console.log('[tourBuilder.ts] Package Name:', payload.packageName);
    console.log('[tourBuilder.ts] Endpoint: POST /api/tour-builder');
    console.log('[tourBuilder.ts] Request Payload:', JSON.stringify(payload, null, 2));
    
    const api = getApiInstance();
    console.log('[tourBuilder.ts] Sending POST request...');
    const res = await api.post<TourApiResponse<TourPackage>>('/api/tour-builder', payload);
    
    console.log('[tourBuilder.ts] ✅ API Response Status:', res.status);
    console.log('[tourBuilder.ts] Response Data:', res.data);
    console.log('[tourBuilder.ts] Created Tour ID:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] ❌ API Error Status:', error?.response?.status);
    console.error('[tourBuilder.ts] Error Message:', error?.message);
    console.error('[tourBuilder.ts] Error Response Data:', error?.response?.data);
    console.error('[tourBuilder.ts] Full Error:', error);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/tour-builder/:tourPackageId
 * Update an existing tour package (admin only)
 */
export async function updateTourPlan(tourPackageId: string, payload: UpdateTourPlanData): Promise<TourPackage> {
  try {
    console.log('[tourBuilder.ts] Updating tour plan:', tourPackageId);
    const api = getApiInstance();
    const res = await api.put<TourApiResponse<TourPackage>>(`/api/tour-builder/${tourPackageId}`, payload);
    console.log('[tourBuilder.ts] updateTourPlan success, id:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] updateTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * DELETE /api/tour-builder/:tourPackageId
 * Delete a tour package (admin only)
 */
export async function deleteTourPlan(tourPackageId: string): Promise<{ success: boolean }> {
  try {
    console.log('[tourBuilder.ts] Deleting tour plan:', tourPackageId);
    const api = getApiInstance();
    await api.delete(`/api/tour-builder/${tourPackageId}`);
    console.log('[tourBuilder.ts] deleteTourPlan success');
    return { success: true };
  } catch (error: any) {
    console.error('[tourBuilder.ts] deleteTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/tour-spots
 * Fetch list of available tour spots, optionally filtered by location
 */
export async function getTourSpots(locationId?: string): Promise<Array<{ id: string; name: string; location: string }>> {
  try {
    const params: Record<string, string | number> = { limit: 100 };
    if (locationId) params.locationId = locationId;

    console.log('[tourBuilder.ts] Fetching tour spots from: /api/tour-spots', params);
    const api = getApiInstance();

    const res = await api.get<TourApiResponse<any>>('/api/tour-spots', { params });
    const list = unwrapListData<any>(res.data.data).results;
    console.log('[tourBuilder.ts] getTourSpots success, count:', list.length);

    const spots = list.map((spot: any) => ({
      id: spot.id,
      name: spot.name,
      location: [spot.city, spot.state, spot.country]
        .filter(Boolean)
        .join(', ') || 'Unknown Location',
    }));

    return spots;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getTourSpots error:', error?.response?.status, error?.message);
    return [];
  }
}

/**
 * GET /api/activity-spots
 * Fetch list of available activity spots, optionally filtered by location
 */
export async function getActivitySpots(locationId?: string): Promise<Array<{ id: string; name: string; location: string }>> {
  try {
    const params: Record<string, string | number> = { limit: 100 };
    if (locationId) params.locationId = locationId;

    console.log('[tourBuilder.ts] Fetching activity spots from: /api/activity-spots', params);
    const api = getApiInstance();

    const res = await api.get<TourApiResponse<any>>('/api/activity-spots', { params });
    const list = unwrapListData<any>(res.data.data).results;
    console.log('[tourBuilder.ts] getActivitySpots success, count:', list.length);

    const spots = list.map((spot: any) => ({
      id: spot.id,
      name: spot.name,
      location: [spot.city, spot.state, spot.country]
        .filter(Boolean)
        .join(', ') || 'Unknown Location',
    }));

    return spots;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getActivitySpots error:', error?.response?.status, error?.message);
    return [];
  }
}

/**
 * GET /api/tour-builder/my
 * Authenticated user's personal (custom) tour packages
 */
export async function getPersonalTourPlans(filters?: PersonalTourPlanFilters): Promise<TourPackage[]> {
  try {
    const api = getApiInstance();
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.locationId) params.locationId = filters.locationId;
    if (filters?.page !== undefined) params.page = filters.page;
    if (filters?.limit !== undefined) params.limit = filters.limit;

    const res = await api.get<TourApiResponse<TourPackage[] | { results?: TourPackage[] }>>(
      '/api/tour-builder/my',
      { params }
    );
    return unwrapListData<TourPackage>(res.data.data, filters?.page, filters?.limit).results;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getPersonalTourPlans error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/tour-builder/my/:tourPackageId
 */
export async function getPersonalTourPlan(tourPackageId: string): Promise<TourPackage> {
  try {
    const api = getApiInstance();
    const res = await api.get<TourApiResponse<TourPackage>>(`/api/tour-builder/my/${tourPackageId}`);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] getPersonalTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * POST /api/tour-builder/my
 */
export async function createPersonalTourPlan(payload: CreatePersonalTourPlanData): Promise<TourPackage> {
  try {
    const api = getApiInstance();
    const res = await api.post<TourApiResponse<TourPackage>>('/api/tour-builder/my', payload);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] createPersonalTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/tour-builder/my/:tourPackageId
 */
export async function updatePersonalTourPlan(
  tourPackageId: string,
  payload: UpdatePersonalTourPlanData
): Promise<TourPackage> {
  try {
    const api = getApiInstance();
    const res = await api.put<TourApiResponse<TourPackage>>(`/api/tour-builder/my/${tourPackageId}`, payload);
    return res.data.data;
  } catch (error: any) {
    console.error('[tourBuilder.ts] updatePersonalTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * DELETE /api/tour-builder/my/:tourPackageId
 */
export async function deletePersonalTourPlan(tourPackageId: string): Promise<{ success: boolean }> {
  try {
    const api = getApiInstance();
    await api.delete(`/api/tour-builder/my/${tourPackageId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[tourBuilder.ts] deletePersonalTourPlan error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/tour-builder/:tourPackageId/images
 */
export async function deleteTourPlanImages(tourPackageId: string, imageIds: string[]): Promise<void> {
  try {
    const api = getApiInstance();
    await api.put(`/api/tour-builder/${tourPackageId}/images`, { imageIds });
  } catch (error: any) {
    console.error('[tourBuilder.ts] deleteTourPlanImages error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/tour-builder/my/:tourPackageId/images
 */
export async function deletePersonalTourPlanImages(tourPackageId: string, imageIds: string[]): Promise<void> {
  try {
    const api = getApiInstance();
    await api.put(`/api/tour-builder/my/${tourPackageId}/images`, { imageIds });
  } catch (error: any) {
    console.error('[tourBuilder.ts] deletePersonalTourPlanImages error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}
