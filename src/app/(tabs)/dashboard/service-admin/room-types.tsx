import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { RootState } from '@/store/store';
import { getMyHotel } from '@/services/api/users';

export default function RoomTypesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const auth = useSelector((s: RootState) => s.auth);

  const hotelId = auth.user?.serviceEntityId;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHotel = async () => {
    if (!hotelId) {
      setError('Hotel information not found');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await getMyHotel(hotelId);
      setHotel(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load hotel data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHotel();
  };

  const handleCreateRoomType = () => {
    router.push({
      pathname: '/(tabs)/dashboard/service-admin/room-type-form',
      params: { mode: 'create', hotelId },
    });
  };

  const handleEditRoomType = (roomTypeId: string) => {
    router.push({
      pathname: '/(tabs)/dashboard/service-admin/room-type-form',
      params: { mode: 'edit', roomTypeId, hotelId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        className="items-center justify-center flex-1 bg-background dark:bg-background-dark"
      >
        <ActivityIndicator
          size="large"
          color={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <View className="items-center justify-center flex-1 px-6">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
          />
          <Text className="mt-4 text-base text-center text-muted dark:text-muted-dark">
            {error}
          </Text>
          <Pressable
            onPress={fetchHotel}
            className="px-6 py-3 mt-4 rounded-xl bg-primary dark:bg-primary-dark"
          >
            <Text className="font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const roomTypes = hotel?.roomTypes || [];

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, marginBottom: 12 }}
            accessibilityRole="button"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? theme.colors['text-dark'] : theme.colors.text}
            />
          </Pressable>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
                Room Types
              </Text>
              <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                Manage your hotel room types
              </Text>
            </View>
            <Pressable
              onPress={handleCreateRoomType}
              className="px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark"
            >
              <View className="flex-row items-center">
                <Ionicons name="add" size={20} color="#ffffff" />
                <Text className="ml-1 font-semibold text-white">Add</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View className="px-6 pb-6">
          {roomTypes.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Ionicons
                name="bed-outline"
                size={64}
                color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              />
              <Text className="mt-4 text-lg font-semibold text-center text-text dark:text-text-dark">
                No Room Types
              </Text>
              <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark">
                Add your first room type to start managing inventory
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {roomTypes.map((roomType: any) => (
                <Pressable
                  key={roomType.id}
                  onPress={() => handleEditRoomType(roomType.id)}
                  className="p-4 border rounded-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-text dark:text-text-dark">
                        {roomType.roomType} Room
                      </Text>
                      <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                        {roomType.singleBedCount > 0 &&
                          `${roomType.singleBedCount} Single Bed${roomType.singleBedCount > 1 ? 's' : ''}`}
                        {roomType.singleBedCount > 0 && roomType.doubleBedCount > 0 && ' • '}
                        {roomType.doubleBedCount > 0 &&
                          `${roomType.doubleBedCount} Double Bed${roomType.doubleBedCount > 1 ? 's' : ''}`}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-primary dark:text-primary-dark">
                        ৳{roomType.pricePerNight.toLocaleString()}
                      </Text>
                      <Text className="text-xs text-muted dark:text-muted-dark">
                        per night
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-border dark:border-border-dark">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="bed-outline"
                        size={16}
                        color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
                      />
                      <Text className="ml-2 text-sm text-muted dark:text-muted-dark">
                        {roomType.availableCount}/{roomType.totalCount} available
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="mr-2 text-sm text-primary dark:text-primary-dark">
                        Edit
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
