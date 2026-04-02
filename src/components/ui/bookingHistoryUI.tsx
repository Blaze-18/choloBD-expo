import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { BookingCard } from './bookingCard';
import { Ionicons } from '@expo/vector-icons';

interface BookingHistoryItem {
  id: string;
  title: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface BookingHistoryUIProps {
  bookings: any[];
  onRefresh?: () => void;
  onPress?: (id: string) => void;
}
const statusColors = {
  Confirmed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function BookingHistoryUI({ bookings, onPress }: BookingHistoryUIProps) {
  function handlePress(id: string): void {
    if (onPress) {
      onPress(id);
    }
  }

  return (
    <View className="pb-4 mt-8">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-sm text-muted dark:text-muted-dark">Your bookings</Text>
          <Text className="mt-1 text-2xl font-bold font-heading text-text dark:text-text-dark">Recent Stays</Text>
        </View>
      </View>
      
      {bookings.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="text-muted dark:text-muted-dark">No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(i) => i.id}
          className="mt-4"
          scrollEnabled={false}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={(id) => handlePress(id)} />
          )}
        />
      )}
    </View>
  );
}
