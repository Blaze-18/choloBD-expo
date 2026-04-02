import { useCallback, useState } from 'react';
import { getApiInstance } from '../services/api/axiosClient';

export function useServiceAdminLogic() {
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const res = await api.get('/api/users/profile');
      // eslint-disable-next-line no-console
      console.log('[useServiceAdminLogic] fetchProfile response', { url: res.config?.url, status: res.status, data: res.data });
      return res.data?.data ?? null;
    } catch (e) {
      console.error('[useServiceAdminLogic] fetchProfile error', e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // If hotelId is provided, GET /api/hotels/:hotelId, otherwise GET /api/hotels/my
  const fetchMyHotel = useCallback(async (hotelId?: string) => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const url = hotelId ? `/api/hotels/${hotelId}` : '/api/hotels/my';
      const res = await api.get(url);
      // Log full response for debugging (inspect headers, status, data)
      // eslint-disable-next-line no-console
      console.log('[useServiceAdminLogic] fetchMyHotel response', { url: res.config?.url, status: res.status, data: res.data });
      return res.data?.data ?? null;
    } catch (e: any) {
      // Log axios response if available for 4xx/5xx
      // eslint-disable-next-line no-console
      console.error('[useServiceAdminLogic] fetchMyHotel error', e?.response?.status, e?.response?.data ?? e.message);
      // Re-throw to let caller decide how to surface friendly messages
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHotelRooms = useCallback(async (hotelId: string) => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const res = await api.get(`/api/hotel-rooms/rooms/${hotelId}`);
      // Log full response for debugging
      // eslint-disable-next-line no-console
      console.log('[useServiceAdminLogic] fetchHotelRooms response', { url: res.config?.url, status: res.status, data: res.data });
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useServiceAdminLogic] fetchHotelRooms error', e?.response?.status, e?.response?.data ?? e.message);
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
