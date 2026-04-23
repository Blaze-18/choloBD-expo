import { useCallback, useState } from 'react';
import { getUserProfile, getMyHotel, getHotelRooms } from '../services/api/users';

export function useServiceAdminLogic() {
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[useServiceAdminLogic.fetchProfile] 🔄 Calling getUserProfile...');
      const result = await getUserProfile();
      console.log('[useServiceAdminLogic.fetchProfile] ✅ Success:', result);
      return result;
    } catch (e) {
      console.error('[useServiceAdminLogic.fetchProfile] ❌ Error:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyHotel = useCallback(async (hotelId?: string) => {
    try {
      setLoading(true);
      console.log('[useServiceAdminLogic.fetchMyHotel] 🔄 Calling getMyHotel...', { hotelId });
      const result = await getMyHotel(hotelId);
      console.log('[useServiceAdminLogic.fetchMyHotel] ✅ Success:', { isArray: Array.isArray(result), result });
      return result;
    } catch (e: any) {
      console.error('[useServiceAdminLogic.fetchMyHotel] ❌ Error:', {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        fullError: e
      });
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHotelRooms = useCallback(async (hotelId: string) => {
    try {
      setLoading(true);
      console.log('[useServiceAdminLogic.fetchHotelRooms] 🔄 Calling getHotelRooms...', { hotelId });
      const result = await getHotelRooms(hotelId);
      console.log('[useServiceAdminLogic.fetchHotelRooms] ✅ Success:', result);
      return result;
    } catch (e: any) {
      console.error('[useServiceAdminLogic.fetchHotelRooms] ❌ Error:', {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data
      });
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
