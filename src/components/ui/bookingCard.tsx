import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingCardProps {
  booking: any;
  onPress?: (id: string) => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const title = booking?.hotel?.name ?? booking?.hotelName ?? booking?.confirmationCode ?? 'Booking';
  const checkIn = booking?.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '';
  const checkOut = booking?.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '';
  const status = booking?.status ?? booking?.paymentStatus ?? 'PENDING';
  const price = booking?.totalPrice ?? booking?.price ?? 0;

  return (
    <TouchableOpacity onPress={() => onPress && onPress(booking.id)} activeOpacity={0.8}>
      <View className="p-4 mb-3 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark" style={{ elevation: 2 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="bed" size={22} color="#3b82f6" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <Text className="font-semibold text-text dark:text-text-dark">{title}</Text>
              <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{checkIn} → {checkOut}</Text>
            </View>
          </View>
          <View className="items-end ml-4">
            <Text className="text-sm font-bold text-text dark:text-text-dark">{Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)}</Text>
            <Text className="text-xs mt-1 text-muted dark:text-muted-dark">{status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
