import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../hooks/useTheme';
import { UserInfoUI } from '../ui/userInfoUI';
import { AdminCard } from '../ui/adminCard';
import { UserStatsOverview } from '../ui/UserStatsOverview';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { RootState } from '../../store/store';

interface UserDashboardProps {
  userName?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  userStatus?: string;
  onLogout: () => void;
}

export function UserDashboard({
  userName,
  email,
  imageUrl,
  role,
  userStatus,
  onLogout,
}: UserDashboardProps) {
  const auth = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={undefined}>
        <View className="px-6 pt-8 pb-2">
          <Text className="text-sm text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.DASHBOARD.WELCOME_BACK)}</Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">{t(TRANSLATION_KEYS.DASHBOARD.USER_TITLE)}</Text>
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

          <View className="mt-6">
            <UserStatsOverview userId={auth.user?.id} />
          </View>

          <View className="mt-4 space-y-3">
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_BOOKINGS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_BOOKINGS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/user-bookings')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_PACKAGE_BOOKINGS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_PACKAGE_BOOKINGS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/package-bookings')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_GUIDE_BOOKINGS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_GUIDE_BOOKINGS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/guide-bookings')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_ACTIVITY_BOOKINGS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_ACTIVITY_BOOKINGS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/activity-bookings')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_CUSTOM_TOURS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_CUSTOM_TOURS_DESC)}
              onPress={() => router.push('/(tabs)/explore/my-tours')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.EXPLORE_HOTELS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.EXPLORE_HOTELS_DESC)}
              onPress={() => router.push('/(tabs)/explore')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.TRIP_PLANNER)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.TRIP_PLANNER_DESC)}
              onPress={() => router.push('/(tabs)/trip-planner')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserDashboard;
