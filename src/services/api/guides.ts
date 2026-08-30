/**
 * Guide API Client
 * Handles all HTTP calls to the /api/guides endpoints
 */

import { getApiInstance } from './axiosClient';
import {
  Guide,
  GuideApiResponse,
  GuideAvailabilityParams,
  GuideAvailabilityResult,
  GuideError,
  GuideFilters,
  GuidePaginatedResult,
  GuideSearchParams,
  UpdateGuideAvailabilityData,
  UpdateGuideData,
} from '../../types/guides';

/**
 * Helper to map HTTP errors to a typed GuideError
 */
function mapApiError(error: any): GuideError {
  console.error('[guides.ts] Mapping API error:', error?.response?.status, error?.message);

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
      return { type: 'NOT_FOUND', statusCode: 404, message: message || 'Guide not found.', details };
    case 409:
      return { type: 'CONFLICT', statusCode: 409, message: message || 'Conflict: cannot perform this action.', details };
    case 500:
      return { type: 'SERVER', statusCode: 500, message: 'Server error. Please try again later.', details };
    default:
      return { type: 'UNKNOWN', statusCode: error?.response?.status || 0, message: error?.message || 'An unknown error occurred.', details };
  }
}

/**
 * The list endpoints return a plain array when no pagination is requested and
 * a `{ results, total, page, limit }` object when both page and limit are sent.
 * This normalizes both into the paginated shape.
 */
function normalizeGuideList(data: any, fallbackPage = 1, fallbackLimit = 0): GuidePaginatedResult<Guide> {
  if (Array.isArray(data)) {
    return { results: data, total: data.length, page: fallbackPage, limit: fallbackLimit || data.length };
  }
  return {
    results: data?.results ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? fallbackPage,
    limit: data?.limit ?? fallbackLimit,
  };
}

/**
 * Builds the query object shared by the list and search endpoints
 */
function buildGuideParams(filters?: GuideFilters): Record<string, any> {
  const params: Record<string, any> = {};
  if (!filters) return params;
  if (filters.locationId) params.locationId = filters.locationId;
  if (filters.divisionId) params.divisionId = filters.divisionId;
  if (filters.specialization) params.specialization = filters.specialization;
  if (filters.language) params.language = filters.language;
  if (filters.isActive !== undefined) params.isActive = filters.isActive;
  if (filters.isVerified !== undefined) params.isVerified = filters.isVerified;
  if (filters.minRating !== undefined) params.minRating = filters.minRating;
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.name) params.name = filters.name;
  return params;
}

/**
 * GET /api/guides
 * Public listing of guides. Defaults to active guides only on the backend.
 * @param filters - Location, specialization, language, rating and pagination
 * @returns Guides plus pagination metadata
 */
export async function getGuides(filters?: GuideFilters): Promise<GuidePaginatedResult<Guide>> {
  try {
    const api = getApiInstance();
    const params = buildGuideParams(filters);

    const res = await api.get<GuideApiResponse<Guide[] | GuidePaginatedResult<Guide>>>('/api/guides', { params });

    const normalized = normalizeGuideList(res.data.data, filters?.page ?? 1, filters?.limit ?? 0);
    console.log('[guides.ts] getGuides success, count:', normalized.results.length, 'total:', normalized.total);
    return normalized;
  } catch (error: any) {
    console.error('[guides.ts] getGuides error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/guides
 * Keyword search is the same list endpoint with a `name` filter.
 */
export async function searchGuides(searchParams: GuideSearchParams): Promise<GuidePaginatedResult<Guide>> {
  return getGuides({
    ...searchParams,
    name: searchParams.q,
  });
}

/**
 * GET /api/guides?locationId=
 * All active guides operating in a location.
 */
export async function getGuidesByLocation(locationId: string): Promise<Guide[]> {
  const result = await getGuides({ locationId, limit: 100 });
  return result.results;
}

/**
 * GET /api/guides/:guideId
 * Public guide detail including up to 10 recent reviews.
 * Contact fields are stripped unless the viewer owns the guide profile.
 * @param guideId - Guide UUID
 * @returns Guide detail
 */
export async function getGuideById(guideId: string): Promise<Guide> {
  try {
    const api = getApiInstance();
    const res = await api.get<GuideApiResponse<Guide>>(`/api/guides/${guideId}`);
    console.log('[guides.ts] getGuideById success:', guideId);
    return res.data.data;
  } catch (error: any) {
    console.error('[guides.ts] getGuideById error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/guides/:guideId/availability
 * Checks whether a guide can take a booking for the given window.
 * @param guideId - Guide UUID
 * @param params - bookingDate and endTime are required ISO8601 strings
 * @returns Availability flag with an optional reason when unavailable
 */
export async function checkGuideAvailability(
  guideId: string,
  params: GuideAvailabilityParams
): Promise<GuideAvailabilityResult> {
  try {
    const api = getApiInstance();
    const res = await api.get<GuideApiResponse<GuideAvailabilityResult>>(
      `/api/guides/${guideId}/availability`,
      { params }
    );
    console.log('[guides.ts] checkGuideAvailability:', guideId, res.data.data?.available);
    return res.data.data;
  } catch (error: any) {
    console.error('[guides.ts] checkGuideAvailability error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * GET /api/guides/my
 * The authenticated service admin's own guide profile, with contact fields intact.
 * @returns Guide profile owned by the current user
 */
export async function getMyGuide(): Promise<Guide> {
  try {
    const api = getApiInstance();
    const res = await api.get<GuideApiResponse<Guide>>('/api/guides/my');
    console.log('[guides.ts] getMyGuide success:', res.data.data?.id);
    return res.data.data;
  } catch (error: any) {
    console.error('[guides.ts] getMyGuide error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/guides/:guideId
 * Guide operator updates their own profile. Requires SERVICE_ADMIN or MASTER_ADMIN.
 * @param guideId - Guide UUID
 * @param data - Partial profile fields
 * @returns Updated guide
 */
export async function updateGuide(guideId: string, data: UpdateGuideData): Promise<Guide> {
  try {
    const api = getApiInstance();
    const res = await api.put<GuideApiResponse<Guide>>(`/api/guides/${guideId}`, data);
    console.log('[guides.ts] updateGuide success:', guideId);
    return res.data.data;
  } catch (error: any) {
    console.error('[guides.ts] updateGuide error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}

/**
 * PUT /api/guides/:guideId/availability
 * Guide operator updates working days, hours and blocked dates.
 * @param guideId - Guide UUID
 * @param data - Availability fields
 * @returns Updated guide
 */
export async function updateGuideAvailability(
  guideId: string,
  data: UpdateGuideAvailabilityData
): Promise<Guide> {
  try {
    const api = getApiInstance();
    const res = await api.put<GuideApiResponse<Guide>>(`/api/guides/${guideId}/availability`, data);
    console.log('[guides.ts] updateGuideAvailability success:', guideId);
    return res.data.data;
  } catch (error: any) {
    console.error('[guides.ts] updateGuideAvailability error:', error?.response?.status, error?.message);
    throw mapApiError(error);
  }
}
