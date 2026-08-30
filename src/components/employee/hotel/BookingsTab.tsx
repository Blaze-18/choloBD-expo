import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { RootState } from '@/store/store';
import { getUserHotelBookings } from '@/services/api/hotelBookings';

export function BookingsTab() {
  const { isDark } = useTheme();
  const auth = useSelector((s: RootState) => s.auth);
  
  const hotelId = auth.user?.employeeServiceEntityId || auth.user?.serviceEntityId;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('today');

  useEffect(() => {
    if (hotelId) {
      fetchBookings();
    }
  }, [hotelId, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserHotelBookings({ hotelId });
      
      let filtered = data.results;
      const today = new Date().toDateString();

      if (filter === 'today') {
        filtered = filtered.filter((b: any) => {
          const checkIn = new Date(b.checkInDate).toDateString();
          const checkOut = new Date(b.checkOutDate).toDateString();
          return checkIn === today || checkOut === today;
        });
      } else if (filter === 'upcoming') {
        filtered = filtered.filter((b: any) => {
          const checkIn = new Date(b.checkInDate);
          return checkIn > new Date();
        });
      }

      setBookings(filtered);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#3B82F6';
      case 'CHECKED_IN':
        return '#10B981';
      case 'CHECKED_OUT':
        return '#6B7280';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator
          size="large"
          color={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
        />
      </View>
    );
  }

  const renderBookingItem = ({ item }: { item: any }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <View className="p-4 mb-3 border rounded-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-text dark:text-text-dark">
              {item.confirmationCode}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
              {item.user?.name || 'Guest'}
            </Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${statusColor}20` }}
          >
            <Text className="text-xs font-semibold" style={{ color: statusColor }}>
              {item.status}
            </Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row items-center">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
            />
            <Text className="ml-2 text-sm text-text dark:text-text-dark">
              {new Date(item.checkInDate).toLocaleDateString()} - {new Date(item.checkOutDate).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="bed-outline"
              size={16}
              color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
            />
            <Text className="ml-2 text-sm text-text dark:text-text-dark">
              Room {item.room?.roomNumber || 'TBD'} - {item.roomType?.roomType || 'N/A'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="cash-outline"
              size={16}
              color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
            />
            <Text className="ml-2 text-sm text-primary dark:text-primary-dark font-semibold">
              ৳{item.totalCost?.toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 p-6">
      <Text className="mb-4 text-lg font-semibold text-text dark:text-text-dark">
        Hotel Bookings
      </Text>

      {/* Filter Tabs */}
      <View className="flex-row gap-2 mb-4">
        {(['today', 'upcoming', 'all'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className="px-4 py-2 border rounded-lg"
            style={{
              backgroundColor:
                filter === f
                  ? isDark
                    ? theme.colors['primary-dark']
                    : theme.colors.primary
                  : 'transparent',
              borderColor:
                filter === f
                  ? isDark
                    ? theme.colors['primary-dark']
                    : theme.colors.primary
                  : isDark
                  ? theme.colors['border-dark']
                  : theme.colors.border,
            }}
          >
            <Text
              className="text-sm font-semibold capitalize"
              style={{
                color:
                  filter === f
                    ? '#ffffff'
                    : isDark
                    ? theme.colors['text-dark']
                    : theme.colors.text,
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {bookings.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Ionicons
            name="calendar-outline"
            size={64}
            color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
          />
          <Text className="mt-4 text-base text-center text-muted dark:text-muted-dark">
            No bookings found
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
