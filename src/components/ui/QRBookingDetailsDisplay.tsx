import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import type { QRBookingDetail } from '../../types/qr';

interface QRBookingDetailsDisplayProps {
  booking: QRBookingDetail;
}

export const QRBookingDetailsDisplay: React.FC<QRBookingDetailsDisplayProps> = ({ booking }) => {
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">Booking Details</Text>
          <Text className="text-sm text-muted dark:text-muted-dark mt-1">{booking.confirmationCode}</Text>
        </View>

        {/* Guest Info */}
        <View className="mb-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
          <Text className="font-semibold text-text dark:text-text-dark mb-3">Guest Information</Text>
          <Text className="text-sm text-text dark:text-text-dark">
            {booking.user.firstName || booking.user.userName} {booking.user.lastName || ''}
          </Text>
          <Text className="text-sm text-muted dark:text-muted-dark">{booking.user.email}</Text>
          {booking.user.phoneNumber && (
            <Text className="text-sm text-muted dark:text-muted-dark">{booking.user.phoneNumber}</Text>
          )}
        </View>

        {/* Room Details */}
        <View className="mb-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
          <Text className="font-semibold text-text dark:text-text-dark mb-3">Room Details</Text>
          <FlatList
            data={booking.roomDetails}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View className="mb-3 pb-3 border-b border-border dark:border-border-dark last:border-b-0">
                <Text className="font-semibold text-text dark:text-text-dark">
                  Room {item.hotelRoom.roomNumber}
                </Text>
                <Text className="text-sm text-muted dark:text-muted-dark">
                  Type: {item.hotelRoomType.roomType}
                </Text>
                <Text className="text-sm text-muted dark:text-muted-dark">
                  ${item.pricePerNight} / night
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>

        {/* Check-in/Out Dates */}
        <View className="mb-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
          <Text className="font-semibold text-text dark:text-text-dark mb-3">Stay Dates</Text>
          <Text className="text-sm text-text dark:text-text-dark">
            Check-in: {checkInDate.toLocaleDateString()} {checkInDate.toLocaleTimeString()}
          </Text>
          <Text className="text-sm text-text dark:text-text-dark">
            Check-out: {checkOutDate.toLocaleDateString()} {checkOutDate.toLocaleTimeString()}
          </Text>
        </View>

        {/* Payment & Special Requests */}
        <View className="mb-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
          <Text className="font-semibold text-text dark:text-text-dark mb-3">Additional Info</Text>
          <Text className="text-sm text-text dark:text-text-dark">
            Payment: {booking.paymentMethod}
          </Text>
          <Text className="text-sm text-text dark:text-text-dark">
            Total: ${booking.totalPrice}
          </Text>
          <Text className="text-sm text-muted dark:text-muted-dark">
            Status: {booking.status}
          </Text>
        </View>

        {/* Special Requests */}
        {booking.specialRequests && (
          <View className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl border border-yellow-200 dark:border-yellow-700">
            <Text className="font-semibold text-yellow-900 dark:text-yellow-50 mb-2">Special Requests</Text>
            <Text className="text-sm text-yellow-900 dark:text-yellow-100">{booking.specialRequests}</Text>
          </View>
        )}

        {/* Hotel Info */}
        <View className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
          <Text className="font-semibold text-text dark:text-text-dark mb-3">Hotel Information</Text>
          <Text className="text-sm text-text dark:text-text-dark">{booking.hotel.name}</Text>
          {booking.hotel.location && (
            <Text className="text-sm text-muted dark:text-muted-dark">
              {booking.hotel.location.city || booking.hotel.location.name}
            </Text>
          )}
          <Text className="text-sm text-muted dark:text-muted-dark">{booking.hotel.phoneNumber}</Text>
          <Text className="text-sm text-muted dark:text-muted-dark">{booking.hotel.email}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default QRBookingDetailsDisplay;
