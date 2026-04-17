import { useState } from 'react';
import { Alert } from 'react-native';
import { fetchHotelById } from '../services/api/hotelDetail';
import { HotelDetail } from '../types/hotels';

export function useFetchHotelDetail() {
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHotelDetail = async (hotelId: string) => {
    try {
      setLoading(true);
      const data = await fetchHotelById(hotelId);
      setHotel(data);
      return data;
    } catch (e: any) {
      if (__DEV__) console.error('[useFetchHotelDetail] error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load hotel details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    hotel,
    loading,
    fetchHotelDetail,
    clearHotel: () => setHotel(null),
  };
}
