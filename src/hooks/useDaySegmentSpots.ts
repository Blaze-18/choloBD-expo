import { useState, useEffect } from 'react';
import { getTourSpots, getActivitySpots } from '../services/api/tourBuilder';

interface Spot {
  id: string;
  name: string;
  location?: string;
}

export function useDaySegmentSpots(locationId?: string, shouldFetch: boolean = true) {
  const [tourSpots, setTourSpots] = useState<Spot[]>([]);
  const [activitySpots, setActivitySpots] = useState<Spot[]>([]);
  const [spotsLoading, setSpotsLoading] = useState(false);

  const fetchAvailableSpots = async () => {
    if (!shouldFetch) return;
    
    try {
      setSpotsLoading(true);
      const [spots, activities] = await Promise.all([
        getTourSpots(locationId),
        getActivitySpots(locationId),
      ]);
      setTourSpots(spots);
      setActivitySpots(activities);
    } catch (error) {
      if (__DEV__) console.error('[useDaySegmentSpots] Error fetching spots:', error);
    } finally {
      setSpotsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSpots();
  }, [locationId, shouldFetch]);

  const getTourSpotName = (spotId: string) => {
    return tourSpots.find((s) => s.id === spotId)?.name || spotId;
  };

  const getActivitySpotName = (spotId: string) => {
    return activitySpots.find((s) => s.id === spotId)?.name || spotId;
  };

  return {
    tourSpots,
    activitySpots,
    spotsLoading,
    getTourSpotName,
    getActivitySpotName,
    refetch: fetchAvailableSpots,
  };
}
