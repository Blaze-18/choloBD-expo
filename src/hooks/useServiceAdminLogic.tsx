import { useCallback, useState } from 'react';
import { getUserProfile, getMyHotel, getHotelRooms } from '../services/api/users';

export function useServiceAdminLogic() {
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      return await getUserProfile();
    } catch (e) {
      if (__DEV__) console.error('[useServiceAdminLogic] fetchProfile error', e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyHotel = useCallback(async (hotelId?: string) => {
    try {
      setLoading(true);
      return await getMyHotel(hotelId);
    } catch (e: any) {
      if (__DEV__) console.error('[useServiceAdminLogic] fetchMyHotel error', e?.response?.status, e?.response?.data ?? e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHotelRooms = useCallback(async (hotelId: string) => {
    try {
      setLoading(true);
      return await getHotelRooms(hotelId);
    } catch (e: any) {
      if (__DEV__) console.error('[useServiceAdminLogic] fetchHotelRooms error', e?.response?.status, e?.response?.data ?? e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchProfile,
    fetchMyHotel,
    fetchHotelRooms,
  };
}

export default useServiceAdminLogic;
