import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingCardProps {
  booking: any;
  onPress?: (id: string) => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(booking.id)} activeOpacity={0.8}>
      <View className="p-4 mb-3 bg-white rounded-xl border border-border dark:bg-surface-dark dark:border-border-dark shadow">
        {/* Header: Guest name and status badges */}
        <View className="flex-row justify-between items-start">
          <View style={{ flex: 1 }}>
            <Text className="font-semibold text-base text-text dark:text-text-dark">
              {booking.guestName || booking.guest || 'Guest'}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="mail" size={12} color="#666" style={{ marginRight: 4 }} />
              <Text className="text-xs text-muted dark:text-muted-dark flex-1">
                {booking.guestEmail || 'N/A'}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="call" size={12} color="#666" style={{ marginRight: 4 }} />
              <Text className="text-xs text-muted dark:text-muted-dark">
                {booking.guestPhoneNumber || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Status badges */}
          <View className="ml-3 items-end">
            <View
              style={{ backgroundColor: `${getStatusColor(booking.status)}20` }}
              className="px-2 py-1 rounded-md mb-1"
            >
              <Text style={{ color: getStatusColor(booking.status) }} className="text-xs font-semibold">
                {booking.status || 'Unknown'}
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${getPaymentStatusColor(booking.paymentStatus)}20` }}
              className="px-2 py-1 rounded-md"
            >
              <Text style={{ color: getPaymentStatusColor(booking.paymentStatus) }} className="text-xs font-semibold">
                {booking.paymentStatus || 'Unpaid'}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-border dark:bg-border-dark my-3" />

        {/* Booking details */}
        <View>
          {/* Confirmation code */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="receipt" size={14} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-sm text-text dark:text-text-dark">
              <Text className="font-semibold">Confirmation: </Text>
              {booking.confirmationCode || booking.id?.substring(0, 8) || 'N/A'}
            </Text>
          </View>

          {/* Check-in and check-out */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={14} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-sm text-text dark:text-text-dark">
              {booking.checkInDate || 'N/A'} → {booking.checkOutDate || 'N/A'}
            </Text>
          </View>

          {/* Total price */}
          <View className="flex-row items-center">
            <Ionicons name="cash" size={14} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-sm font-semibold text-text dark:text-text-dark">
              ₹{booking.totalPrice ?? 'N/A'}
            </Text>
            {booking.bookedAt && (
              <Text className="text-xs text-muted dark:text-muted-dark ml-auto">
                {new Date(booking.bookedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        {/* Room details if available */}
        {booking.roomDetails && booking.roomDetails.length > 0 && (
          <View className="mt-3 pt-3 border-t border-border dark:border-border-dark">
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-2">Rooms:</Text>
            {booking.roomDetails.map((room: any, idx: number) => (
              <Text key={idx} className="text-xs text-muted dark:text-muted-dark">
                • Room {room.hotelRoom?.roomNumber || '?'} ({room.pricePerNight}/night)
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
