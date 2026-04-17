import { getApiInstance } from './axiosClient';
import { HotelDetail, RoomType } from '../../types/hotels';

export async function fetchHotelById(hotelId: string): Promise<HotelDetail | null> {
  const api = getApiInstance();
  const res = await api.get(`/api/hotels/${hotelId}`);
  return res.data.data || null;
}

export { HotelDetail, RoomType } from '../../types/hotels';
