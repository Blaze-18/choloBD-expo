import { getApiInstance } from './axiosClient';

export interface CreateHotelRoomTypeData {
  hotelId: string;
  roomType: string;
  singleBedCount: number;
  doubleBedCount: number;
  pricePerNight: number;
  totalCount?: number;
  availableCount?: number;
  imageURLs?: string[];
}

export interface UpdateHotelRoomTypeData {
  roomType?: string;
  singleBedCount?: number;
  doubleBedCount?: number;
  pricePerNight?: number;
  totalCount?: number;
  availableCount?: number;
  imageURLs?: string[];
}

export interface UpdateHotelRoomData {
  roomStatus: string;
}

/**
 * Create a new room type for a hotel
 */
export async function createHotelRoomType(data: CreateHotelRoomTypeData): Promise<any> {
  const api = getApiInstance();
  console.log('[hotelRooms.createHotelRoomType] 📡 POST /api/hotel-rooms/roomTypes', data);
  const res = await api.post('/api/hotel-rooms/roomTypes', data);
  console.log('[hotelRooms.createHotelRoomType] 📦 Response:', res.data);
  return res.data.data;
}

/**
 * Update an existing room type
 */
export async function updateHotelRoomType(
  roomTypeId: string,
  data: UpdateHotelRoomTypeData
): Promise<any> {
  const api = getApiInstance();
  console.log(`[hotelRooms.updateHotelRoomType] 📡 PUT /api/hotel-rooms/roomTypes/${roomTypeId}`, data);
  const res = await api.put(`/api/hotel-rooms/roomTypes/${roomTypeId}`, data);
  console.log('[hotelRooms.updateHotelRoomType] 📦 Response:', res.data);
  return res.data.data;
}

/**
 * Delete images from a room type
 */
export async function deleteHotelRoomTypeImages(
  roomTypeId: string,
  imageIds: string[]
): Promise<any> {
  const api = getApiInstance();
  console.log(`[hotelRooms.deleteHotelRoomTypeImages] 📡 PUT /api/hotel-rooms/roomTypes/${roomTypeId}/images`, { imageIds });
  const res = await api.put(`/api/hotel-rooms/roomTypes/${roomTypeId}/images`, { imageIds });
  console.log('[hotelRooms.deleteHotelRoomTypeImages] 📦 Response:', res.data);
  return res.data.data;
}

/**
 * Update a specific hotel room's status
 */
export async function updateHotelRoom(
  roomId: string,
  data: UpdateHotelRoomData
): Promise<any> {
  const api = getApiInstance();
  console.log(`[hotelRooms.updateHotelRoom] 📡 PUT /api/hotel-rooms/rooms/${roomId}`, data);
  const res = await api.put(`/api/hotel-rooms/rooms/${roomId}`, data);
  console.log('[hotelRooms.updateHotelRoom] 📦 Response:', res.data);
  return res.data.data;
}

/**
 * Get all rooms for a hotel
 */
export async function getHotelRooms(hotelId: string): Promise<any[]> {
  const api = getApiInstance();
  console.log(`[hotelRooms.getHotelRooms] 📡 GET /api/hotel-rooms/rooms/${hotelId}`);
  const res = await api.get(`/api/hotel-rooms/rooms/${hotelId}`);
  console.log('[hotelRooms.getHotelRooms] 📦 Response:', res.data);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}
