import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BookingCard } from '../../../components/ui/bookingCard';
import { useTheme } from '../../../hooks/useTheme';
import { useDashboardLogic } from '../../../hooks/useDashboardLogic';
import theme from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';

export default function UserBookingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { bookings, loading, onRefresh, onPressBooking } = useDashboardLogic();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-1 p-6">
        {/* Header with back button */}
        <View className="flex-row items-center mb-6">
          <Pressable 
            onPress={() => router.back()} 
            style={{ padding: 6, marginRight: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text dark:text-text-dark">
              {t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_BOOKINGS)}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.DASHBOARD.USER_CARDS.MY_BOOKINGS_DESC)}
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center justify-center flex-1 mt-6">
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.COMMON.LOADING)}
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="items-center p-6 py-12 mt-6 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
            <Ionicons 
              name="calendar-clear-outline" 
              size={48} 
              color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} 
            />
            <Text className="mt-4 text-base font-semibold text-text dark:text-text-dark">
              {t(TRANSLATION_KEYS.DASHBOARD.NO_BOOKINGS)}
            </Text>
            <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark">
              Book your first hotel stay from the Explore tab
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BookingCard 
                  booking={item} 
                  onPress={onPressBooking} 
                />
              )}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              onRefresh={onRefresh}
              refreshing={loading}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
