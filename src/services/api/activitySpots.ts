/**
 * Activity Spots API Service
 * Handles fetching activity spots from the backend
 */

import { getApiInstance } from './axiosClient';
import { unwrapListData } from '../../utils/paginatedList';

export interface ActivitySpot {
  id: string;
  name: string;
  description?: string;
  location: string;
  imageUrl?: string;
  rating?: number;
}

export interface ActivitySpotFilters {
  locationId?: string;
  divisionId?: string;
  name?: string;
  activityType?: string;
  isActive?: boolean;
  isPopular?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}

export async function getActivitySpots(
  locationIdOrFilters?: string | ActivitySpotFilters
): Promise<ActivitySpot[]> {
  const api = getApiInstance();
  const filters: ActivitySpotFilters =
    typeof locationIdOrFilters === 'string'
      ? { locationId: locationIdOrFilters }
      : locationIdOrFilters ?? {};

  const params: Record<string, string | number | boolean> = { limit: filters.limit ?? 100 };
  if (filters.locationId) params.locationId = filters.locationId;
  if (filters.divisionId) params.divisionId = filters.divisionId;
  if (filters.name) params.name = filters.name;
  if (filters.activityType) params.activityType = filters.activityType;
  if (filters.isActive !== undefined) params.isActive = filters.isActive;
  if (filters.isPopular !== undefined) params.isPopular = filters.isPopular;
  if (filters.minRating !== undefined) params.minRating = filters.minRating;
  if (filters.page !== undefined) params.page = filters.page;

  const response = await api.get('/api/activity-spots', { params });
  const data = unwrapListData<any>(response.data.data, filters.page, filters.limit).results;
  return data.map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    description: spot.description,
    location: spot.location?.name
      || [spot.city, spot.state, spot.country].filter(Boolean).join(', ')
      || 'Unknown Location',
    imageUrl: spot.images?.[0]?.url || spot.imageUrl,
    rating: spot.rating,
  }));
}


