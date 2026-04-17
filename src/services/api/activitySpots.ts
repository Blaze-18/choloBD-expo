/**
 * Activity Spots API Service
 * Handles fetching activity spots from the backend
 */

import { getApiInstance } from './axiosClient';

export interface ActivitySpot {
  id: string;
  name: string;
  description?: string;
  location: string;
  imageUrl?: string;
  rating?: number;
}

export async function getActivitySpots(locationId: string): Promise<ActivitySpot[]> {
  const api = getApiInstance();
  const response = await api.get(`/api/activity-spots/location/${locationId}`);
  const data = response.data.data || [];
  return data.map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    description: spot.description,
    location: [spot.city, spot.state, spot.country].filter(Boolean).join(', ') || 'Unknown Location',
    imageUrl: spot.imageUrl,
    rating: spot.rating,
  }));
}


