import { useState } from 'react';
import { Alert } from 'react-native';
import { getApiInstance } from './axiosClient';
import { HotelDetail, RoomType } from '../../types/hotels';

export function useFetchHotelDetail() {
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHotelDetail = async (hotelId: string) => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const res = await api.get(`/api/hotels/${hotelId}`);
      const hotelData = res.data.data || null;
      setHotel(hotelData);
      return hotelData;
    } catch (e: any) {
      console.error('[Explore] fetchHotelDetail error', e?.response?.data || e.message);
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

export { HotelDetail, RoomType } from '../../types/hotels';
