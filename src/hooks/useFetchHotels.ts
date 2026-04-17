import { useState } from 'react';
import { Alert } from 'react-native';
import { fetchHotels, HotelFilters } from '../services/api/hotels';
import { Hotel } from '../types/hotels';

export function useFetchHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHotelsAction = async (filters: HotelFilters = {}) => {
    try {
      setLoading(true);
      const data = await fetchHotels(filters);
      setHotels(data);
    } catch (e: any) {
      if (__DEV__) console.error('[useFetchHotels] error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  return {
    hotels,
    loading,
    fetchHotels: fetchHotelsAction,
    clearHotels: () => setHotels([]),
  };
}
