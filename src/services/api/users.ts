import { getApiInstance } from './axiosClient';

export async function getUserProfile(): Promise<any> {
  const api = getApiInstance();
  const res = await api.get('/api/users/profile');
  return res.data?.data ?? null;
}

export async function getMyHotel(hotelId?: string): Promise<any> {
  const api = getApiInstance();
  const url = hotelId ? `/api/hotels/${hotelId}` : '/api/hotels/my';
  const res = await api.get(url);
  return res.data?.data ?? null;
}

export async function getHotelRooms(hotelId: string): Promise<any[]> {
  const api = getApiInstance();
  const res = await api.get(`/api/hotel-rooms/rooms/${hotelId}`);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}
