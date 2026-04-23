import { getApiInstance } from './axiosClient';

export async function getUserProfile(): Promise<any> {
  const api = getApiInstance();
  console.log('[users.getUserProfile] 📡 GET /api/users/profile');
  const res = await api.get('/api/users/profile');
  console.log('[users.getUserProfile] 📦 Response:', res.data);
  return res.data?.data ?? null;
}

/**
 * Fetch admin's hotel(s) - Returns array for SERVICE_ADMIN, single hotel for EMPLOYEE
 * Tries new endpoint first, falls back to old endpoint (silently)
 */
export async function getMyHotel(hotelId?: string): Promise<any> {
  const api = getApiInstance();
  
  // If hotelId provided, use old single hotel endpoint for backward compatibility
  if (hotelId) {
    console.log('[users.getMyHotel] 📡 GET /api/hotels/' + hotelId);
    const res = await api.get(`/api/hotels/${hotelId}`);
    console.log('[users.getMyHotel] 📦 Response:', res.data);
    return res.data?.data ?? null;
  }
  
  // Try new endpoint first
  try {
    console.log('[users.getMyHotel] 📡 Trying NEW endpoint: GET /api/v1/hotels/my-hotel');
    const res = await api.get('/api/v1/hotels/my-hotel', {
      // Custom config to suppress default error logging for this request
      validateStatus: (status) => status < 500, // Don't throw on 4xx
    });
    
    if (res.status === 200) {
      console.log('[users.getMyHotel] ✅ NEW endpoint SUCCESS:', res.data);
      const data = res.data?.data;
      return data ?? null;
    }
  } catch (newEndpointError: any) {
    // Silently catch
  }
  
  // Fallback to old endpoint
  console.log('[users.getMyHotel] 📡 Trying OLD endpoint: GET /api/hotels/my');
  try {
    const res = await api.get('/api/hotels/my');
    console.log('[users.getMyHotel] ✅ OLD endpoint SUCCESS:', res.data);
    const data = res.data?.data;
    return data ?? null;
  } catch (oldEndpointError: any) {
    console.log('[users.getMyHotel] ❌ Both endpoints failed');
    throw oldEndpointError;
  }
}

/**
 * Get room types for a hotel
 * DEPRECATED: Room types now included in getMyHotel() response
 * Kept for backward compatibility
 */
export async function getHotelRooms(hotelId: string): Promise<any[]> {
  const api = getApiInstance();
  console.log('[users.getHotelRooms] 📡 GET /api/hotel-rooms/rooms/' + hotelId);
  const res = await api.get(`/api/hotel-rooms/rooms/${hotelId}`);
  console.log('[users.getHotelRooms] 📦 Response:', res.data);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}
