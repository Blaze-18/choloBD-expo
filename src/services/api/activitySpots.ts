/**
 * Activity Spots API Service
 * Handles fetching activity spots from the backend
 */

import { useState, useEffect } from 'react';
import { getApiInstance } from './axiosClient';

export interface ActivitySpot {
  id: string;
  name: string;
  description?: string;
  location: string;
  imageUrl?: string;
  rating?: number;
}

/**
 * Hook to fetch activity spots for a specific location
 * @param locationId - The ID of the location to fetch activity spots for
 * @returns Object with activity spots list, loading state, and error
 */
export function useFetchActivitySpots(locationId: string | undefined) {
  const [spots, setSpots] = useState<ActivitySpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) {
      setSpots([]);
      return;
    }

    const fetchSpots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('[activitySpots] Fetching activity spots for location:', locationId);

        const api = getApiInstance();
        const response = await api.get(`/api/activity-spots/location/${locationId}`);

        const data = response.data.data || [];
        console.log('[activitySpots] Fetched', data.length, 'activity spots');

        // Transform response to ActivitySpot format
        const transformedSpots: ActivitySpot[] = data.map((spot: any) => ({
          id: spot.id,
          name: spot.name,
          description: spot.description,
          location: [spot.city, spot.state, spot.country]
            .filter(Boolean)
            .join(', ') || 'Unknown Location',
          imageUrl: spot.imageUrl,
          rating: spot.rating,
        }));

        setSpots(transformedSpots);
      } catch (err: any) {
        console.error('[activitySpots] Error fetching activity spots:', err?.message);
        setError(err?.message || 'Failed to fetch activity spots');
        setSpots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, [locationId]);

  return { spots, isLoading, error };
}

/**
 * Direct function to fetch activity spots
 * @param locationId - The ID of the location
 * @returns Promise with activity spots list
 */
export async function getActivitySpots(locationId: string): Promise<ActivitySpot[]> {
  try {
    console.log('[activitySpots] Fetching activity spots for location:', locationId);
    const api = getApiInstance();
    const response = await api.get(`/api/activity-spots/location/${locationId}`);

    const data = response.data.data || [];
    console.log('[activitySpots] Fetched', data.length, 'activity spots');

    const transformedSpots: ActivitySpot[] = data.map((spot: any) => ({
      id: spot.id,
      name: spot.name,
      description: spot.description,
      location: [spot.city, spot.state, spot.country]
        .filter(Boolean)
        .join(', ') || 'Unknown Location',
      imageUrl: spot.imageUrl,
      rating: spot.rating,
    }));

    return transformedSpots;
  } catch (error: any) {
    console.error('[activitySpots] Error fetching activity spots:', error?.message);
    return [];
  }
}
