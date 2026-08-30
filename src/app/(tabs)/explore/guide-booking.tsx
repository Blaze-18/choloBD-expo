/**
 * Guide Booking Page
 * Collects a guide request and confirms it with the returned code
 */

import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { useAuthWithAdminCheck } from '../../../hooks/useAuthWithAdminCheck';
import { useFetchGuideDetail } from '../../../hooks/useFetchGuideDetail';
import { useGuideBookingLogic, SubmitGuideBookingInput } from '../../../hooks/useGuideBookingLogic';
import { GuideBookingForm } from '../../../components/guides';
import { GuideBooking } from '../../../types/guides';

export default function GuideBookingPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthWithAdminCheck();

  const { guide, isLoading, error, availability, availabilityLoading, verifyAvailability } = useFetchGuideDetail(id);
  const { submitBooking, submitting } = useGuideBookingLogic();

  const [createdBooking, setCreatedBooking] = useState<GuideBooking | null>(null);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const handleSubmit = async (input: SubmitGuideBookingInput) => {
    const booking = await submitBooking(input);
    if (booking) setCreatedBooking(booking);
  };

  const renderHeader = (title: string) => (
    <View className="px-6 pb-2 flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
        <Ionicons name="chevron-back" size={24} color={primaryColor} />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-text dark:text-text-dark">{title}</Text>
    </View>
  );

  // Success state
  if (createdBooking) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-background-dark">
        {renderHeader(t(TRANSLATION_KEYS.GUIDE_BOOKING.TITLE))}
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="checkmark-circle" size={72} color={successColor} />
          <Text className="mt-4 text-2xl font-bold text-text dark:text-text-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.SUCCESS_TITLE)}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.SUCCESS_DESC)}
          </Text>

          <View className="mt-6 items-center">
            <Text className="text-xs text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRMATION_CODE)}
            </Text>
            <Text className="mt-1 text-lg font-bold text-text dark:text-text-dark">
              {createdBooking.confirmationCode}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/dashboard/guide-bookings')}
            style={{ marginTop: 28, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, backgroundColor: primaryColor, alignSelf: 'stretch', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              {t(TRANSLATION_KEYS.GUIDE_BOOKING.VIEW_MY_BOOKINGS)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/explore/guides-list')}
            style={{ marginTop: 12, paddingVertical: 12 }}
          >
            <Text style={{ color: primaryColor, fontWeight: '600' }}>
              {t(TRANSLATION_KEYS.GUIDE_BOOKING.BROWSE_GUIDES)}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-background-dark">
      {renderHeader(t(TRANSLATION_KEYS.GUIDE_BOOKING.TITLE))}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : error || !guide ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="person-circle-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {error || t(TRANSLATION_KEYS.GUIDES.GUIDE_NOT_FOUND)}
          </Text>
        </View>
      ) : !isAuthenticated ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="lock-closed-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.LOGIN_REQUIRED)}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, backgroundColor: primaryColor }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN)}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <GuideBookingForm
          guide={guide}
          submitting={submitting}
          availability={availability}
          availabilityLoading={availabilityLoading}
          onCheckAvailability={verifyAvailability}
          onSubmit={handleSubmit}
        />
      )}
    </SafeAreaView>
  );
}
