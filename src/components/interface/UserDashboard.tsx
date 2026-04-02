import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserInfoUI } from '../ui/userInfoUI';
import { BookingHistoryUI } from '../ui/bookingHistoryUI';

interface UserDashboardProps {
  userName?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  userStatus?: string;
  bookings: any[];
  onLogout: () => void;
  onRefresh: () => void;
  onPressBooking: (bookingId: string) => void;
}

export function UserDashboard({
  userName,
  email,
  imageUrl,
  role,
  userStatus,
  bookings,
  onLogout,
  onRefresh,
  onPressBooking,
}: UserDashboardProps) {
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={undefined}>
        <View className="px-6 pt-8 pb-2">
          <Text className="text-sm text-muted dark:text-muted-dark">Welcome back,</Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">Dashboard</Text>
        </View>

        <View className="px-6 pb-8">
          <UserInfoUI
            userName={userName}
            email={email}
            imageUrl={imageUrl}
            role={role}
            userStatus={userStatus}
            onLogout={onLogout}
          />
          <BookingHistoryUI bookings={bookings} onRefresh={onRefresh} onPress={onPressBooking} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserDashboard;
