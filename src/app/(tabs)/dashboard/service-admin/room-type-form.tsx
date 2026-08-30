import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { useHotelRoomManagement } from '@/hooks/useHotelRoomManagement';
import { getMyHotel } from '@/services/api/users';

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE', 'PREMIUM', 'EXECUTIVE'];

export default function RoomTypeFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { loading, handleCreateRoomType, handleUpdateRoomType } = useHotelRoomManagement();

  const mode = params.mode as 'create' | 'edit';
  const hotelId = params.hotelId as string;
  const roomTypeId = params.roomTypeId as string;

  const [formData, setFormData] = useState({
    roomType: 'STANDARD',
    singleBedCount: '0',
    doubleBedCount: '0',
    pricePerNight: '',
    totalCount: '',
    availableCount: '',
  });

  const [loadingData, setLoadingData] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && roomTypeId && hotelId) {
      loadRoomType();
    }
  }, [mode, roomTypeId, hotelId]);

  const loadRoomType = async () => {
    try {
      setLoadingData(true);
      const hotel = await getMyHotel(hotelId);
      const roomType = hotel?.roomTypes?.find((rt: any) => rt.id === roomTypeId);
      
      if (roomType) {
        setFormData({
          roomType: roomType.roomType || 'STANDARD',
          singleBedCount: String(roomType.singleBedCount || 0),
          doubleBedCount: String(roomType.doubleBedCount || 0),
          pricePerNight: String(roomType.pricePerNight || ''),
          totalCount: String(roomType.totalCount || ''),
          availableCount: String(roomType.availableCount || ''),
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load room type details');
      router.back();
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price per night');
      return;
    }

    if (!formData.totalCount || parseInt(formData.totalCount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid total count');
      return;
    }

    const singleBed = parseInt(formData.singleBedCount) || 0;
    const doubleBed = parseInt(formData.doubleBedCount) || 0;

    if (singleBed === 0 && doubleBed === 0) {
      Alert.alert('Validation Error', 'Please add at least one bed');
      return;
    }

    try {
      const data = {
        roomType: formData.roomType,
        singleBedCount: singleBed,
        doubleBedCount: doubleBed,
        pricePerNight: parseFloat(formData.pricePerNight),
        totalCount: parseInt(formData.totalCount),
        availableCount: formData.availableCount ? parseInt(formData.availableCount) : parseInt(formData.totalCount),
      };

      if (mode === 'create') {
        await handleCreateRoomType({
          ...data,
          hotelId,
        });
      } else {
        await handleUpdateRoomType(roomTypeId, data);
      }

      router.back();
    } catch (error) {
      // Error already handled in hook
    }
  };

  if (loadingData) {
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

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
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

          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
            {mode === 'create' ? 'Add Room Type' : 'Edit Room Type'}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {mode === 'create' ? 'Create a new room type' : 'Update room type details'}
          </Text>
        </View>

        <View className="px-6 pb-6">
          {/* Room Type Selection */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Room Type *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ROOM_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setFormData({ ...formData, roomType: type })}
                  className="px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor:
                      formData.roomType === type
                        ? isDark
                          ? theme.colors['primary-dark']
                          : theme.colors.primary
                        : 'transparent',
                    borderColor:
                      formData.roomType === type
                        ? isDark
                          ? theme.colors['primary-dark']
                          : theme.colors.primary
                        : isDark
                        ? theme.colors['border-dark']
                        : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color:
                        formData.roomType === type
                          ? '#ffffff'
                          : isDark
                          ? theme.colors['text-dark']
                          : theme.colors.text,
                    }}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bed Configuration */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Bed Configuration *
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-2 text-xs text-muted dark:text-muted-dark">
                  Single Beds
                </Text>
                <TextInput
                  value={formData.singleBedCount}
                  onChangeText={(text) => setFormData({ ...formData, singleBedCount: text })}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
                  className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                  style={{ fontSize: 16 }}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-2 text-xs text-muted dark:text-muted-dark">
                  Double Beds
                </Text>
                <TextInput
                  value={formData.doubleBedCount}
                  onChangeText={(text) => setFormData({ ...formData, doubleBedCount: text })}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
                  className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                  style={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>

          {/* Price Per Night */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Price Per Night (৳) *
            </Text>
            <TextInput
              value={formData.pricePerNight}
              onChangeText={(text) => setFormData({ ...formData, pricePerNight: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              style={{ fontSize: 16 }}
            />
          </View>

          {/* Room Inventory */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Room Inventory *
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-2 text-xs text-muted dark:text-muted-dark">
                  Total Rooms
                </Text>
                <TextInput
                  value={formData.totalCount}
                  onChangeText={(text) => setFormData({ ...formData, totalCount: text })}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
                  className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                  style={{ fontSize: 16 }}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-2 text-xs text-muted dark:text-muted-dark">
                  Available (Optional)
                </Text>
                <TextInput
                  value={formData.availableCount}
                  onChangeText={(text) => setFormData({ ...formData, availableCount: text })}
                  placeholder="Same as total"
                  keyboardType="number-pad"
                  placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
                  className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                  style={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className="p-4 mt-4 rounded-xl"
            style={{
              backgroundColor:
                loading
                  ? isDark
                    ? theme.colors['muted-dark']
                    : theme.colors.muted
                  : isDark
                  ? theme.colors['primary-dark']
                  : theme.colors.primary,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-semibold text-center text-white">
                {mode === 'create' ? 'Create Room Type' : 'Update Room Type'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
