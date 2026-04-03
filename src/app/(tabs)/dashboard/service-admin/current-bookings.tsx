import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrentBookingsFetch } from '../../../../hooks/useCurrentBookingsFetch';
import { BookingCard } from '../../../../components/ui/bookingCard';

export default function CurrentBookingsPage() {
  const router = useRouter();
  const { bookings, pagination, loading, error, currentPage, setCurrentPage } = useCurrentBookingsFetch(20);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-1 p-6">
        <Pressable onPress={() => router.replace('/(tabs)/dashboard')} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2 text-text dark:text-text-dark">Current Bookings</Text>
        <Text className="mt-1 text-sm text-muted dark:text-muted-dark">Active bookings for your hotels</Text>

        {loading ? (
          <View className="mt-6 items-center flex-1 justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-sm text-muted dark:text-muted-dark mt-4">Loading bookings...</Text>
          </View>
        ) : error ? (
          <View className="mt-6 p-4 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#ef4444" style={{ marginRight: 8 }} />
              <Text className="text-sm text-text dark:text-text-dark flex-1">{error}</Text>
            </View>
          </View>
        ) : bookings.length === 0 ? (
          <View className="mt-6 p-4 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark items-center py-8">
            <Ionicons name="calendar-clear" size={32} color="#9ca3af" />
            <Text className="text-sm text-muted dark:text-muted-dark mt-3">No bookings found</Text>
          </View>
        ) : (
          <View className="flex-1 mt-6">
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BookingCard booking={item} />}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            />

            {/* Pagination controls */}
            <View className="flex-row items-center justify-between mt-4 p-3 bg-white dark:bg-surface-dark rounded-lg border border-border dark:border-border-dark">
              <Pressable
                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className={`px-3 py-2 rounded-lg ${currentPage <= 1 ? 'bg-gray-200' : 'bg-primary'}`}
              >
                <Ionicons name="chevron-back" size={18} color={currentPage <= 1 ? '#9ca3af' : '#fff'} />
              </Pressable>

              <Text className="text-sm text-text dark:text-text-dark">
                Page <Text className="font-semibold">{currentPage}</Text> of{' '}
                <Text className="font-semibold">{pagination?.pages ?? '-'}</Text>
              </Text>

              <Pressable
                onPress={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination || pagination.page >= pagination.pages}
                className={`px-3 py-2 rounded-lg ${!pagination || pagination.page >= pagination.pages ? 'bg-gray-200' : 'bg-primary'}`}
              >
                <Ionicons name="chevron-forward" size={18} color={!pagination || pagination.page >= pagination.pages ? '#9ca3af' : '#fff'} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
