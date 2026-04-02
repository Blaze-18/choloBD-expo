import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TrackingCardProps {
  title: string; // Hotel name
  subtitle?: string; // Guest name or booking ID
  checkInDate?: string;
  checkOutDate?: string;
  onDetailsPress: () => void;
  onQRPress: () => void;
  onCameraPress?: () => void;
  isServiceAdmin?: boolean;
}

export const TrackingCard: React.FC<TrackingCardProps> = ({
  title,
  subtitle,
  checkInDate,
  checkOutDate,
  onDetailsPress,
  onQRPress,
  onCameraPress,
  isServiceAdmin = false,
}) => {
  const checkIn = checkInDate ? new Date(checkInDate).toLocaleDateString() : '';
  const checkOut = checkOutDate ? new Date(checkOutDate).toLocaleDateString() : '';

  return (
    <View className="mb-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark" style={{ elevation: 2 }}>
      {/* Title */}
      <View className="mb-3">
        <Text className="text-lg font-semibold text-text dark:text-text-dark">{title}</Text>
        {subtitle && <Text className="text-sm text-muted dark:text-muted-dark mt-1">{subtitle}</Text>}
      </View>

      {/* Dates */}
      {(checkIn || checkOut) && (
        <View className="mb-3 pb-3 border-b border-border dark:border-border-dark">
          <Text className="text-xs text-muted dark:text-muted-dark">
            {checkIn && checkOut ? `${checkIn} → ${checkOut}` : checkIn || checkOut}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row items-center justify-between pt-2">
        {/* Details Button (Left) */}
        <Pressable
          onPress={onDetailsPress}
          className="flex-row items-center px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900"
        >
          <Ionicons name="information-circle-outline" size={16} color="#3b82f6" style={{ marginRight: 6 }} />
          <Text className="text-sm font-semibold text-primary">Details</Text>
        </Pressable>

        {/* Right Side Buttons */}
        <View className="flex-row items-center gap-2">
          {/* QR Button - All users get this */}
          <Pressable
            onPress={onQRPress}
            className="p-2 rounded-lg bg-green-50 dark:bg-green-900 items-center justify-center"
            style={{ width: 36, height: 36 }}
          >
            <Ionicons name="qr-code" size={18} color="#10b981" />
          </Pressable>

          {/* Camera Button - Only for service admins */}
          {isServiceAdmin && onCameraPress && (
            <Pressable
              onPress={onCameraPress}
              className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900 items-center justify-center"
              style={{ width: 36, height: 36 }}
            >
              <Ionicons name="camera-outline" size={18} color="#a855f7" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default TrackingCard;
