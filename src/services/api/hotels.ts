import { useState } from 'react';
import { Alert } from 'react-native';
import { getApiInstance } from './axiosClient';
import { Hotel } from '../../types/hotels';

export function useFetchHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHotels = async (filters: {
    locationId?: string;
    hotelType?: string;
    minRating?: number;
    maxRating?: number;
    isActive?: boolean;
  }) => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const params: any = {};

      if (filters.locationId) params.locationId = filters.locationId;
      if (filters.hotelType) params.hotelType = filters.hotelType;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxRating) params.maxRating = filters.maxRating;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;

      const res = await api.get('/api/hotels', { params });
      const hotelsData = res.data.data || [];
      setHotels(hotelsData);
    } catch (e: any) {
      console.error('[Explore] fetchHotels error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  return {
    hotels,
    loading,
    fetchHotels,
    clearHotels: () => setHotels([]),
  };
}

export { Hotel } from '../../types/hotels';
