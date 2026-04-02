import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AdminCard } from '../../../../components/ui/adminCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useServiceAdminLogic } from '../../../../hooks/useServiceAdminLogic';

export default function ServiceAdminIndex() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);
  const { fetchProfile, fetchMyHotel } = useServiceAdminLogic();
  const [hotel, setHotel] = useState<any | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!auth.user?.id) return;
        const profile = await fetchProfile();
        // eslint-disable-next-line no-console
        console.log('[ServiceAdminIndex] profile', profile);

        // Confirm service type
        if (!profile || profile.serviceType !== 'HOTEL_BOOKING') {
          setMessage('No hotel assigned');
          setHotel(null);
          return;
        }

        const serviceEntityId = profile.serviceEntityId;
        if (!serviceEntityId) {
          setMessage('No hotel assigned');
          setHotel(null);
          return;
        }

        // Use the /api/hotels/my endpoint (fetchMyHotel without id) which reads authenticated user's serviceEntityId
        const res = await fetchMyHotel();
        // eslint-disable-next-line no-console
        console.log('[ServiceAdminIndex] fetchMyHotel result', res);
        if (!res) {
          setMessage('Hotel not found — contact admin');
          setHotel(null);
          return;
        }
        setHotel(res);
        setMessage(null);
      } catch (e: any) {
        console.error('[ServiceAdminIndex] load hotel error', e);
        if (e?.response?.status === 404) {
          setMessage('Hotel not found — contact admin');
        } else {
          setMessage('Failed to load hotel');
        }
      }
    };
    load();
  }, [auth.user?.id, fetchMyHotel]);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-6 pt-6">
        <Text className="text-2xl font-bold text-text dark:text-text-dark">My Hotels</Text>
        <Text className="text-sm text-muted dark:text-muted-dark mt-1">Tap a hotel to view details</Text>

        <View className="mt-6 space-y-3">
          {hotel ? (
            <AdminCard
              title={hotel.name ?? 'Unnamed Hotel'}
              subtitle={hotel.location?.name ?? '—'}
              onPress={() => router.push(`/(tabs)/dashboard/service-admin/hotel-info?hotelId=${hotel.id}`)}
            />
          ) : (
            <View className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark">
              <Text className="text-sm text-muted dark:text-muted-dark">{message ?? 'Loading...'}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
