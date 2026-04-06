import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getApiInstance } from './axiosClient';
import { Location } from '../../types/locations';

export function useFetchLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const api = getApiInstance();
      // Trying to fetch locations - endpoint may vary based on backend
      const res = await api.get('/api/locations');
      const locationsData = res.data.data || [];
      setLocations(locationsData);
    } catch (e: any) {
      console.error('[Explore] fetchLocations error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    refetch: fetchLocations,
  };
}

export { Location } from '../../types/locations';
