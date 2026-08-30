import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { getUserHotelBookings } from '@/services/api/hotelBookings';
import { getPackageBookings } from '@/services/api/packageBookings';
import { getActivityBookings } from '@/services/api/activityBookings';
import { getGuideBookings } from '@/services/api/guideBookings';

interface UserStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
  hotelBookings: number;
  packageBookings: number;
  activityBookings: number;
  guideBookings: number;
}

interface UserStatsOverviewProps {
  userId?: string;
}

export function UserStatsOverview({ userId }: UserStatsOverviewProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);

        const [hotelData, packageData, activityData, guideData] = await Promise.allSettled([
          getUserHotelBookings({ userId }),
          getPackageBookings({ userId }),
          getActivityBookings({ userId }),
          getGuideBookings({ userId }),
        ]);

        const hotelBookings = hotelData.status === 'fulfilled' ? hotelData.value.results : [];
        const packageBookings = packageData.status === 'fulfilled' ? packageData.value.results : [];
        const activityBookings = activityData.status === 'fulfilled' ? activityData.value.results : [];
        const guideBookings = guideData.status === 'fulfilled' ? guideData.value.results : [];

        const allBookings = [
          ...hotelBookings.map((b: any) => ({ ...b, type: 'hotel' })),
          ...packageBookings.map((b: any) => ({ ...b, type: 'package' })),
          ...activityBookings.map((b: any) => ({ ...b, type: 'activity' })),
          ...guideBookings.map((b: any) => ({ ...b, type: 'guide' })),
        ];

        const activeStatuses = ['PENDING', 'CONFIRMED'];
        const completedStatuses = ['COMPLETED', 'CHECKED_OUT'];

        const activeCount = allBookings.filter((b) =>
          activeStatuses.includes(b.status)
        ).length;

        const completedCount = allBookings.filter((b) =>
          completedStatuses.includes(b.status)
        ).length;

        const totalSpent = allBookings.reduce((sum, b) => {
          const amount = b.totalCost || b.totalPrice || b.totalAmount || 0;
          return sum + amount;
        }, 0);

        setStats({
          totalBookings: allBookings.length,
          activeBookings: activeCount,
          completedBookings: completedCount,
          totalSpent,
          hotelBookings: hotelBookings.length,
          packageBookings: packageBookings.length,
          activityBookings: activityBookings.length,
          guideBookings: guideBookings.length,
        });
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <View className="p-4 mb-4 border rounded-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark">
        <ActivityIndicator
          size="small"
          color={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
        />
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <View className="flex-1 p-3 border rounded-lg bg-white dark:bg-surface-dark border-border dark:border-border-dark">
      <View className="flex-row items-center mb-2">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
      </View>
      <Text className="text-xl font-bold font-heading text-text dark:text-text-dark">
        {value}
      </Text>
      <Text className="text-xs text-muted dark:text-muted-dark mt-1">
        {label}
      </Text>
    </View>
  );

  return (
    <View className="mb-4">
      <Text className="mb-3 text-base font-semibold text-text dark:text-text-dark px-1">
        {t(TRANSLATION_KEYS.DASHBOARD.STATS.OVERVIEW)}
      </Text>

      {/* Main Stats Grid */}
      <View className="flex-row gap-3 mb-3">
        <StatCard
          icon="calendar-outline"
          label={t(TRANSLATION_KEYS.DASHBOARD.STATS.TOTAL_BOOKINGS)}
          value={stats.totalBookings}
          color={isDark ? theme.colors['primary-dark'] : theme.colors.primary}
        />
        <StatCard
          icon="time-outline"
          label={t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVE)}
          value={stats.activeBookings}
          color="#10B981"
        />
      </View>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          icon="checkmark-circle-outline"
          label={t(TRANSLATION_KEYS.DASHBOARD.STATS.COMPLETED)}
          value={stats.completedBookings}
          color="#3B82F6"
        />
        <StatCard
          icon="cash-outline"
          label={t(TRANSLATION_KEYS.DASHBOARD.STATS.TOTAL_SPENT)}
          value={`৳${(stats.totalSpent / 1000).toFixed(1)}K`}
          color="#F59E0B"
        />
      </View>

      {/* Booking Types Breakdown */}
      <View className="p-4 mt-2 border rounded-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark">
        <Text className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.DASHBOARD.STATS.BOOKING_BREAKDOWN)}
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="bed-outline"
                size={16}
                color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              />
              <Text className="ml-2 text-sm text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.STATS.HOTELS)}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-primary dark:text-primary-dark">
              {stats.hotelBookings}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="map-outline"
                size={16}
                color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              />
              <Text className="ml-2 text-sm text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.STATS.PACKAGES)}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-primary dark:text-primary-dark">
              {stats.packageBookings}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="bicycle-outline"
                size={16}
                color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              />
              <Text className="ml-2 text-sm text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVITIES)}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-primary dark:text-primary-dark">
              {stats.activityBookings}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="person-outline"
                size={16}
                color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              />
              <Text className="ml-2 text-sm text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.STATS.GUIDES)}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-primary dark:text-primary-dark">
              {stats.guideBookings}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
