import React, { useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { AdminCard } from '@/components/ui/adminCard';

// Placeholder stats - in production, this would come from API
const TRANSPORT_STATS = {
  totalVehicles: 12,
  activeVehicles: 10,
  totalTrips: 45,
  completedTrips: 32,
  scheduledTrips: 13,
  totalTicketsSold: 890,
  totalRevenue: 445000,
  averageTicketPrice: 500,
  occupancyRate: 78.5,
  cancellationRate: 3.2,
};

export default function TransportAdminDashboard() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [loading] = useState(false);

  // In production, check if transport operator is assigned
  const transportAssigned = true;

  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.LOADING)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!transportAssigned) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background dark:bg-background-dark">
        <View className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, marginBottom: 12 }}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
          </Pressable>
          
          <Text className="text-2xl font-bold text-text dark:text-text-dark mb-2">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.TITLE)}
          </Text>
          
          <View className="mt-6 p-6 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
            <Ionicons
              name="bus-outline"
              size={48}
              color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
            />
            <Text className="mt-4 text-base font-semibold text-text dark:text-text-dark">
              {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.NO_TRANSPORT_ASSIGNED)}
            </Text>
            <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.NO_TRANSPORT_DESC)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-8 pb-4">
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, marginBottom: 12 }}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
          </Pressable>
          
          <Text className="text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.ADMIN_TITLE)}
          </Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.TITLE)}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.SUBTITLE)}
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.STATS_TITLE)}
          </Text>
          
          <View className="grid grid-cols-2 gap-3">
            {/* Total Vehicles */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.TOTAL_VEHICLES)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">
                {TRANSPORT_STATS.totalVehicles}
              </Text>
            </View>

            {/* Active Vehicles */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.ACTIVE_VEHICLES)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-primary dark:text-primary-dark">
                {TRANSPORT_STATS.activeVehicles}
              </Text>
            </View>

            {/* Total Revenue */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.TOTAL_REVENUE)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">
                ৳{TRANSPORT_STATS.totalRevenue.toLocaleString()}
              </Text>
            </View>

            {/* Tickets Sold */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.TOTAL_TICKETS_SOLD)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">
                {TRANSPORT_STATS.totalTicketsSold}
              </Text>
            </View>

            {/* Occupancy Rate */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.OCCUPANCY_RATE)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">
                {TRANSPORT_STATS.occupancyRate}%
              </Text>
            </View>

            {/* Completed Trips */}
            <View className="p-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
              <Text className="text-xs text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_SERVICE_ADMIN.COMPLETED_TRIPS)}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text dark:text-text-dark">
                {TRANSPORT_STATS.completedTrips}
              </Text>
            </View>
          </View>

          {/* Management Sections */}
          <View className="mt-8 space-y-3">
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_MANAGEMENT)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_MANAGEMENT_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/service-admin/transport-inventory')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_RIDES)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_RIDES_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/service-admin/transport-rides')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_TICKETS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_TICKETS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/service-admin/transport-tickets')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_SALES)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_SALES_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/service-admin/transport-sales')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
