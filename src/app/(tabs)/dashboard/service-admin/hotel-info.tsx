import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../../constants/theme';
import { useServiceAdminLogic } from '../../../../hooks/useServiceAdminLogic';
import { useTheme } from '../../../../hooks/useTheme';

export default function HotelInfoPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const hotelId = params.hotelId as string | undefined;

  const { fetchMyHotel, fetchHotelRooms } = useServiceAdminLogic();
  const [hotel, setHotel] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!hotelId) return;
      setLoading(true);
      try {
        const h = await fetchMyHotel(hotelId);
        // eslint-disable-next-line no-console
        console.log('[HotelInfoPage] fetchMyHotel result', h);
        setHotel(h ?? null);
      } catch (e) {
        console.error('[HotelInfoPage] fetchMyHotel error', e);
      }

      try {
        const rs = await fetchHotelRooms(hotelId);
        // eslint-disable-next-line no-console
        console.log('[HotelInfoPage] fetchHotelRooms result', rs);
        setRooms(rs ?? []);
      } catch (e) {
        console.error('[HotelInfoPage] fetchHotelRooms error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelId, fetchMyHotel, fetchHotelRooms]);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <Pressable onPress={() => router.replace('/(tabs)/dashboard')} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
        </Pressable>

        <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">Hotel Information</Text>
        {loading ? (
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Loading...</Text>
        ) : hotel ? (
          <View>
            <Text className="mt-2 text-sm text-muted dark:text-muted-dark">{hotel.name}</Text>

            <View className="p-4 mt-6 bg-white border rounded-xl border-border dark:bg-surface-dark dark:border-border-dark">
              <Text className="font-semibold text-text dark:text-text-dark">Overview</Text>
              <Text className="mt-2 text-sm text-muted dark:text-muted-dark">{hotel.description ?? '—'}</Text>

              <View className="mt-4">
                <Text className="font-semibold">Location</Text>
                <Text className="text-sm text-muted">{hotel.location?.city ?? hotel.location?.name ?? '—'}</Text>
              </View>

              <View className="mt-4">
                <Text className="font-semibold">Summary</Text>
                <Text className="text-sm text-muted">Total rooms: {hotel.totalRooms ?? '—'}</Text>
                <Text className="text-sm text-muted">Available rooms: {hotel.availableRooms ?? '—'}</Text>
                <Text className="text-sm text-muted">Rating: {hotel.rating ?? '—'}</Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold text-text dark:text-text-dark">Rooms</Text>
              <FlatList
                data={rooms}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                  <View className="p-4 mt-3 bg-white border rounded-xl border-border dark:bg-surface-dark dark:border-border-dark">
                    <Text className="font-semibold text-text dark:text-text-dark">{item.roomNumber ?? item.hotelRoomType?.roomType ?? item.roomType}</Text>
                    <Text className="text-sm text-muted dark:text-muted-dark">Status: {item.roomStatus ?? '—'}</Text>
                    <Text className="text-sm text-muted dark:text-muted-dark">Type: {item.hotelRoomType?.roomType ?? item.roomType ?? '—'}</Text>
                  </View>
                )}
                ListEmptyComponent={() => <Text className="mt-3 text-sm text-muted">No rooms found</Text>}
              />
            </View>
          </View>
        ) : (
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Hotel not found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
