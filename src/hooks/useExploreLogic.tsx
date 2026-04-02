import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getApiInstance } from '../services/api/axiosClient';

export function useExploreLogic() {
  const auth = useSelector((s: RootState) => s.auth);

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [hotelDetails, setHotelDetails] = useState<any | null>(null);
  const [selectedRoomsMap, setSelectedRoomsMap] = useState<Record<string, number>>({});
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhoneNumber, setGuestPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const api = getApiInstance();
      const res = await api.get('/api/hotels');
      setHotels(res.data.data || []);
    } catch (e: any) {
      console.error('[Explore] fetchHotels error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelDetails = async (hotelId: string) => {
    try {
      setLoading(true);
      setSelectedHotelId(hotelId);
      const api = getApiInstance();
      const res = await api.get(`/api/hotels/${hotelId}`);
      setHotelDetails(res.data.data || null);
      setSelectedRoomsMap({});
    } catch (e: any) {
      console.error('[Explore] fetchHotelDetails error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const changeRoomQty = (roomTypeId: string, delta: number) => {
    setSelectedRoomsMap((s) => {
      const prev = s[roomTypeId] || 0;
      const next = Math.max(0, prev + delta);
      return { ...s, [roomTypeId]: next };
    });
  };

  const submitBooking = async () => {
    if (!hotelDetails) return Alert.alert('Select a hotel first');
    if (!checkInDate || !checkOutDate) return Alert.alert('Please enter check-in and check-out dates');
    const anyRooms = Object.values(selectedRoomsMap).some((v) => v > 0);
    if (!anyRooms) return Alert.alert('Please select at least one room');

    setSubmitting(true);
    try {
      const api = getApiInstance();
      const userId = auth.user?.id ?? 'guest';
      const body = {
        hotelId: hotelDetails.id,
        userId,
        checkInDate,
        checkOutDate,
        selectedRoomsMap,
        guestName,
        guestEmail,
        guestPhoneNumber,
      };
      const res = await api.post('/api/bookings/hotel-rooms', body);
      console.log('[Explore] booking created', res.data);
      Alert.alert('Success', 'Booking created: ' + (res.data.data?.confirmationCode || ''));
      // reset
      setSelectedHotelId(null);
      setHotelDetails(null);
      setSelectedRoomsMap({});
      setCheckInDate('');
      setCheckOutDate('');
      setGuestName('');
      setGuestEmail('');
      setGuestPhoneNumber('');
    } catch (e: any) {
      console.error('[Explore] submitBooking error', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    hotels,
    loading,
    selectedHotelId,
    hotelDetails,
    selectedRoomsMap,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhoneNumber,
    setGuestPhoneNumber,
    submitting,
    fetchHotels,
    fetchHotelDetails,
    changeRoomQty,
    submitBooking,
  };
}
