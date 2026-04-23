import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
        console.log('[HotelInfoPage] fetchMyHotel result', h);
        setHotel(h ?? null);

        // If roomTypes are included in hotel response (new backend), extract them
        if (h?.roomTypes) {
          setRooms(h.roomTypes);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('[HotelInfoPage] fetchMyHotel error', e);
      }

      // Fallback: fetch rooms separately (old endpoint for backward compatibility)
      try {
        const rs = await fetchHotelRooms(hotelId);
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

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const warningColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;

  const totalRooms = hotel?._count?.rooms ?? hotel?.totalRooms ?? 0;
  const availableRooms = hotel?.availableRooms ?? 0;
  const rating = hotel?.rating ?? 0;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      {/* Header with Back Button */}
      <View className="px-6 pt-4 pb-2 bg-white border-b dark:bg-surface-dark border-border dark:border-border-dark">
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)/dashboard/service-admin')} 
          className="flex-row items-center mb-4"
        >
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
          <Text className="ml-2 font-semibold text-primary dark:text-primary-dark">Back</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text className="mt-3 text-sm text-muted dark:text-muted-dark">Loading hotel details...</Text>
        </View>
      ) : hotel ? (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="px-6 py-6 pb-8">
            
            {/* Hotel Name & Location */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-text dark:text-text-dark">{hotel.name}</Text>
              <View className="flex-row items-center mt-3">
                <Ionicons name="location" size={16} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} />
                <Text className="ml-2 text-sm text-muted dark:text-muted-dark">
                  {hotel.location?.city ?? hotel.location?.name ?? '—'}
                </Text>
              </View>
            </View>

            {/* Rating & Type Cards */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 p-4 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="mb-1 text-xs text-muted dark:text-muted-dark">Rating</Text>
                    <Text className="text-2xl font-bold text-text dark:text-text-dark">{rating.toFixed(1)}</Text>
                  </View>
                  <Ionicons name="star" size={32} color={warningColor} />
                </View>
              </View>

              <View className="flex-1 p-4 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="mb-1 text-xs text-muted dark:text-muted-dark">Type</Text>
                    <Text className="text-lg font-bold text-text dark:text-text-dark">{hotel.type ?? 'N/A'}</Text>
                  </View>
                  <Ionicons name="building" size={32} color={primaryColor} />
                </View>
              </View>
            </View>

            {/* Overview Card */}
            {hotel.description && (
              <View className="p-4 mb-6 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="information-circle" size={20} color={primaryColor} />
                  <Text className="ml-2 font-semibold text-text dark:text-text-dark">Description</Text>
                </View>
                <Text className="text-sm leading-6 text-muted dark:text-muted-dark">
                  {hotel.description}
                </Text>
              </View>
            )}

            {/* Room Statistics */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="door-open" size={20} color={primaryColor} />
                <Text className="ml-2 text-lg font-semibold text-text dark:text-text-dark">Room Statistics</Text>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 p-4 border border-green-200 bg-green-50 dark:bg-green-950 rounded-xl dark:border-green-800">
                  <Text className="mb-1 text-xs text-green-700 dark:text-green-300">Available Rooms</Text>
                  <Text className="text-2xl font-bold text-green-700 dark:text-green-300">{availableRooms}</Text>
                </View>

                <View className="flex-1 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 rounded-xl dark:border-blue-800">
                  <Text className="mb-1 text-xs text-blue-700 dark:text-blue-300">Total Rooms</Text>
                  <Text className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalRooms}</Text>
                </View>
              </View>
            </View>

            {/* Amenities */}
            {hotel.hotelCategories && hotel.hotelCategories.length > 0 && (
              <View className="p-4 mb-6 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="sparkles" size={20} color={primaryColor} />
                  <Text className="ml-2 font-semibold text-text dark:text-text-dark">Amenities</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {hotel.hotelCategories.map((hc: any) => (
                    <View 
                      key={hc.id} 
                      className="px-3 py-2 border border-blue-200 rounded-full bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
                    >
                      <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {hc.category?.name ?? '—'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Room Types Section */}
            <View>
              <View className="flex-row items-center mb-4">
                <Ionicons name="list" size={20} color={primaryColor} />
                <Text className="ml-2 text-lg font-semibold text-text dark:text-text-dark">
                  Room Types ({rooms.length})
                </Text>
              </View>

              {rooms.length > 0 ? (
                <View className="gap-3">
                  {rooms.map((room, idx) => (
                    <View 
                      key={room.id ?? idx}
                      className="p-4 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark"
                    >
                      {/* Room Type Header */}
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1">
                          <Text className="text-base font-bold text-text dark:text-text-dark">
                            {room.roomType ?? room.hotelRoomType?.roomType ?? 'Unknown Room'}
                          </Text>
                          {room.roomNumber && (
                            <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
                              Room #{room.roomNumber}
                            </Text>
                          )}
                        </View>
                        <View className={`px-3 py-1 rounded-full ${
                          room.roomStatus?.toUpperCase() === 'AVAILABLE'
                            ? 'bg-green-100 dark:bg-green-950'
                            : 'bg-yellow-100 dark:bg-yellow-950'
                        }`}>
                          <Text className={`text-xs font-semibold ${
                            room.roomStatus?.toUpperCase() === 'AVAILABLE'
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {room.roomStatus ?? 'N/A'}
                          </Text>
                        </View>
                      </View>

                      {/* Room Details Grid */}
                      <View className="grid gap-2">
                        {room.pricePerNight && (
                          <View className="flex-row items-center justify-between py-2 border-t border-border dark:border-border-dark">
                            <View className="flex-row items-center">
                              <Ionicons name="cash" size={16} color={successColor} />
                              <Text className="ml-2 text-sm text-muted dark:text-muted-dark">Price per Night</Text>
                            </View>
                            <Text className="font-semibold text-text dark:text-text-dark">₹{room.pricePerNight}</Text>
                          </View>
                        )}

                        {room.availableCount !== undefined && (
                          <View className="flex-row items-center justify-between py-2 border-t border-border dark:border-border-dark">
                            <View className="flex-row items-center">
                              <Ionicons name="checkmark-circle" size={16} color={successColor} />
                              <Text className="ml-2 text-sm text-muted dark:text-muted-dark">Availability</Text>
                            </View>
                            <Text className="font-semibold text-text dark:text-text-dark">
                              {room.availableCount}/{room.totalCount}
                            </Text>
                          </View>
                        )}

                        {room.hotelRoomType?.singleBedCount !== undefined && (
                          <View className="flex-row items-center justify-between py-2 border-t border-border dark:border-border-dark">
                            <View className="flex-row items-center">
                              <Ionicons name="bed" size={16} color={primaryColor} />
                              <Text className="ml-2 text-sm text-muted dark:text-muted-dark">Single Beds</Text>
                            </View>
                            <Text className="font-semibold text-text dark:text-text-dark">
                              {room.hotelRoomType.singleBedCount}
                            </Text>
                          </View>
                        )}

                        {room.hotelRoomType?.doubleBedCount !== undefined && (
                          <View className="flex-row items-center justify-between py-2 border-t border-border dark:border-border-dark">
                            <View className="flex-row items-center">
                              <Ionicons name="bed" size={16} color={primaryColor} />
                              <Text className="ml-2 text-sm text-muted dark:text-muted-dark">Double Beds</Text>
                            </View>
                            <Text className="font-semibold text-text dark:text-text-dark">
                              {room.hotelRoomType.doubleBedCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center p-6 bg-white border dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
                  <Ionicons name="inbox" size={32} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} />
                  <Text className="mt-2 text-sm text-muted dark:text-muted-dark">No room types available</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="items-center justify-center flex-1 px-6">
          <Ionicons name="warning" size={48} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">Hotel not found</Text>
          <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark">
            The hotel information could not be loaded. Please try again.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
