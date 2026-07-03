import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface RoomType {
  id: string;
  name?: string;
  roomType?: string;
  pricePerNight?: number;
  availableCount?: number;
  totalCount?: number;
  singleBedCount?: number;
  doubleBedCount?: number;
  images?: Array<{ url: string }>;
}

interface RoomTypeSelectorUIProps {
  roomTypes: RoomType[];
  selectedRoomsMap: Record<string, number>;
  onChange: (roomTypeId: string, delta: number) => void;
}

export function RoomTypeSelectorUI({ roomTypes, selectedRoomsMap, onChange }: RoomTypeSelectorUIProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;

  return (
    <View className="mt-5">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.AVAILABLE_ROOMS)}</Text>

      {roomTypes.map((roomType) => {
        const label = roomType.name || roomType.roomType || 'Room';
        const price = roomType.pricePerNight ?? 0;
        const available = roomType.availableCount ?? roomType.totalCount ?? undefined;
        const selected = selectedRoomsMap[roomType.id] || 0;
        const primaryImage = roomType.images?.[0]?.url;

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
                    <Ionicons name="cash" size={14} /> ₹{price} {t(TRANSLATION_KEYS.BOOKING.PER_NIGHT)}
                  </Text>
                  {available !== undefined && (
                    <Text className="text-xs text-muted dark:text-muted-dark mt-1">{available} {t(TRANSLATION_KEYS.BOOKING.AVAILABLE)}</Text>
                  )}
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-end mt-3">
              <TouchableOpacity
                onPress={() => onChange(roomType.id, -1)}
                disabled={selected <= 0}
                className={`p-2 rounded-lg ${selected <= 0 ? 'bg-surface-2 dark:bg-surface-2-dark' : 'bg-surface-2 dark:bg-surface-2-dark'}`}
                style={{ opacity: selected <= 0 ? 0.5 : 1 }}
              >
                <Ionicons name="remove" size={18} color={mutedColor} />
              </TouchableOpacity>

              <View className="px-4 py-2 mx-2 rounded-lg bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                <Text className="font-semibold text-center text-text dark:text-text-dark w-8">{selected}</Text>
              </View>

              <TouchableOpacity
                onPress={() => onChange(roomType.id, 1)}
                disabled={available !== undefined && selected >= available}
                className={`p-2 rounded-lg ${available !== undefined && selected >= available ? 'bg-surface-2 dark:bg-surface-2-dark' : 'bg-primary dark:bg-primary-dark'}`}
                style={{ opacity: available !== undefined && selected >= available ? 0.5 : 1 }}
              >
                <Ionicons name="add" size={18} color={available !== undefined && selected >= available ? mutedColor : onPrimaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default RoomTypeSelectorUI;
