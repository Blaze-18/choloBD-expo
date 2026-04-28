import { useState } from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import { fetchHotelById } from '../services/api/hotelDetail';
import {
  translateDescriptionIfNeeded,
  translateDisplayStringListIfNeeded,
} from '../services/api/translation';
import { HotelDetail } from '../types/hotels';

export function useFetchHotelDetail() {
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHotelDetail = async (hotelId: string) => {
    try {
      setLoading(true);
      const data = await fetchHotelById(hotelId);

      if (!data) {
        setHotel(null);
        return null;
      }

      const translatedDescription = await translateDescriptionIfNeeded(
        data.description,
        i18next.language
      );

      const translatedAmenities = await translateDisplayStringListIfNeeded(
        data.amenities,
        i18next.language
      );

      const nextAmenities =
        translatedAmenities.length > 0 || (data.amenities && data.amenities.length > 0)
          ? translatedAmenities
          : data.amenities;

      const nextData: HotelDetail =
        translatedDescription === data.description && nextAmenities === data.amenities
          ? data
          : { ...data, description: translatedDescription, amenities: nextAmenities };

      setHotel(nextData);
      return nextData;
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
