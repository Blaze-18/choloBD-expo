import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { UserInfoUI } from '../ui/userInfoUI';
import { AdminCard } from '../ui/adminCard';

interface ServiceAdminDashboardProps {
  userName?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  userStatus?: string;
  onLogout: () => void;
}

export function ServiceAdminDashboard({
  userName,
  email,
  imageUrl,
  role,
  userStatus,
  onLogout,
}: ServiceAdminDashboardProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={undefined}>
        <View className="px-6 pt-8 pb-2">
          <Text className="text-sm text-muted dark:text-muted-dark">Welcome back,</Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">Owner Dashboard</Text>
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

          <View className="mt-6 space-y-3">
            <AdminCard
              title="My Hotel"
              subtitle="View hotel information"
              onPress={() => router.push('/(tabs)/dashboard/service-admin')}
            />
            <AdminCard
              title="Current Bookings"
              subtitle="View active bookings for your hotels"
              onPress={() => router.push('/(tabs)/dashboard/service-admin/current-bookings')}
            />
            <AdminCard
              title="QR Scanner"
              subtitle="Scan guest check-in codes"
              onPress={() => router.push('/(tabs)/dashboard/service-admin/qr-scanner')}
            />
            <AdminCard
              title="Employee / Staff Info"
              subtitle="Manage your employees"
              onPress={() => router.push('/(tabs)/dashboard/service-admin/staff')}
            />
            <AdminCard
              title="Your Bookings"
              subtitle="Bookings you made as owner"
              onPress={() => router.push('/(tabs)/dashboard/service-admin/your-bookings')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ServiceAdminDashboard;
