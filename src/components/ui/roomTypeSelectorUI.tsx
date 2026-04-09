import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface RoomType {
  id: string;
  // some APIs use `name`, others use `roomType` for the display label
  name?: string;
  roomType?: string;
  pricePerNight?: number;
  availableCount?: number;
  totalCount?: number;
}

interface RoomTypeSelectorUIProps {
  roomTypes: RoomType[];
  selectedRoomsMap: Record<string, number>;
  onChange: (roomTypeId: string, delta: number) => void;
}

export function RoomTypeSelectorUI({ roomTypes, selectedRoomsMap, onChange }: RoomTypeSelectorUIProps) {
  const { isDark } = useTheme();
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;

  return (
    <View className="mt-5">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark">Available Rooms</Text>
      
      {roomTypes.map((roomType) => {
        const label = roomType.name || roomType.roomType || 'Room';
        const price = roomType.pricePerNight ?? 0;
        const available = roomType.availableCount ?? roomType.totalCount ?? undefined;
        const selected = selectedRoomsMap[roomType.id] || 0;
        const primaryImage = (roomType as any).images?.[0]?.url;

        return (
          <View key={roomType.id} className="p-4 mt-3 rounded-xl shadow bg-white dark:bg-surface-dark border border-border dark:border-border-dark">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {primaryImage && (
                  <Image source={{ uri: primaryImage }} className="w-16 h-12 rounded-md mr-3 bg-gray-200" />
                )}
                <View className="flex-1">
                  <Text className="font-semibold text-text dark:text-text-dark">{label}</Text>
                  <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                    <Ionicons name="cash" size={14} /> ₹{price} / night
                  </Text>
                  {available !== undefined && (
                    <Text className="text-xs text-muted dark:text-muted-dark mt-1">{available} available</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Quantity Selector */}
            <View className="flex-row items-center justify-end mt-3">
              <TouchableOpacity
                onPress={() => onChange(roomType.id, -1)}
                disabled={selected <= 0}
                className={`p-2 rounded-lg ${selected <= 0 ? 'bg-gray-200' : 'bg-border'} dark:bg-border-dark`}
              >
                <Ionicons name="remove" size={18} color={mutedColor} />
              </TouchableOpacity>

              <View className="px-4 py-2 mx-2 rounded-lg bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                <Text className="font-semibold text-center text-text dark:text-text-dark w-8">
                  {selectedRoomsMap[roomType.id] || 0}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onChange(roomType.id, 1)}
                disabled={available !== undefined && selected >= available}
                className={`p-2 rounded-lg ${available !== undefined && selected >= available ? 'bg-gray-200' : 'bg-primary'} dark:bg-primary-dark`}
              >
                <Ionicons name="add" size={18} color={onPrimaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
