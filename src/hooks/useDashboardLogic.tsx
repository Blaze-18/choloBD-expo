import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';
import { useRouter } from 'expo-router';
import { useBookingLogic } from './useBookingLogic';

export function useDashboardLogic() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchUserBookings } = useBookingLogic();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchUserBookings(1, 20);
      const data = payload?.data ?? [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('[useDashboardLogic] fetchBookings error', e?.message ?? e);
      Alert.alert('Error', 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  }, [fetchUserBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.replace('/(auth)/login');
    } catch (e) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  const onPressBooking = (bookingId: string) => {
    router.push(`/(tabs)/dashboard/${bookingId}`);
  };

  return {
    auth,
    bookings,
    loading,
    handleLogout,
    onPressBooking,
    onRefresh: fetchBookings,
  };
}
