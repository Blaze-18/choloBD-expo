import React, { useEffect } from 'react';
import { View, ScrollView, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import theme from '../../../constants/theme';
import { RootState } from '../../../store/store';
import { useDashboardLogic } from '../../../hooks/useDashboardLogic';
import { TrackingCard } from '../../../components/ui/TrackingCard';

export default function TrackingPage() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);
  const { bookings, loading, onRefresh } = useDashboardLogic();
  const { isDark } = useTheme();

  // Refresh bookings when page is focused
  useEffect(() => {
    onRefresh();
  }, []);

  const isServiceAdmin = (auth.user as any)?.role === 'SERVICE_ADMIN';

  const handleDetailsPress = (bookingId: string) => {
    router.push(`/(tabs)/dashboard/${bookingId}`);
  };

  const handleQRPress = (bookingId: string) => {
    router.push(`/(tabs)/dashboard/${bookingId}/qr-generate`);
  };

  const handleCameraPress = () => {
    // Navigate to QR scanner for service admin
    router.push('/(tabs)/dashboard/service-admin/qr-scanner');
  };

  const renderBookingCard = ({ item }: { item: any }) => {
    // For regular users: show hotel name
    // For service admins: show guest name
    const displayTitle = isServiceAdmin
      ? item.user?.userName || item.user?.firstName || 'Guest'
      : item.hotel?.name || 'Hotel';

    const displaySubtitle = isServiceAdmin
      ? item.hotel?.name
      : item.user?.userName || item.user?.email;

    return (
      <TrackingCard
        title={displayTitle}
        subtitle={displaySubtitle}
        checkInDate={item.checkInDate}
        checkOutDate={item.checkOutDate}
        onDetailsPress={() => handleDetailsPress(item.id)}
        onQRPress={() => handleQRPress(item.id)}
        onCameraPress={isServiceAdmin ? handleCameraPress : undefined}
        isServiceAdmin={isServiceAdmin}
      />
    );
  };

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark" showsVerticalScrollIndicator={false}>
      <View className="px-6 pt-8 pb-4">
        <Text className="text-sm text-muted dark:text-muted-dark">Manage your stays</Text>
        <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">Track your booking</Text>
      </View>

      {loading ? (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : bookings && bookings.length > 0 ? (
        <View className="px-6 pb-8">
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingCard}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View className="px-6 py-12 items-center">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-2">No bookings found</Text>
          <Text className="text-sm text-muted dark:text-muted-dark">
            {isServiceAdmin ? 'No guest bookings yet' : 'You have no active bookings'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
