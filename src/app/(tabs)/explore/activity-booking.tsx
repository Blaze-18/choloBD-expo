import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { RootState } from '@/store/store';
import { useActivityBookingLogic } from '@/hooks/useActivityBookingLogic';

export default function ActivityBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const auth = useSelector((s: RootState) => s.auth);
  const { loading, handleCreate } = useActivityBookingLogic();

  const activitySpotId = params.activitySpotId as string;
  const activitySpotName = params.activitySpotName as string || 'Activity';
  const entryCost = Number(params.entryCost) || 0;

  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [participantCount, setParticipantCount] = useState('1');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'sslcommerz' | 'cash'>('sslcommerz');

  const totalPrice = entryCost * parseInt(participantCount || '1', 10);

  const handleSubmit = async () => {
    if (!auth.user?.id) {
      Alert.alert('Error', 'Please log in to book activities');
      return;
    }

    if (!activitySpotId) {
      Alert.alert('Error', 'Activity spot information is missing');
      return;
    }

    if (!bookingDate) {
      Alert.alert('Error', 'Please select a booking date');
      return;
    }

    try {
      await handleCreate({
        activitySpotId,
        userId: auth.user.id,
        bookingDate,
        participantCount: parseInt(participantCount, 10),
        specialRequirements: specialRequirements || undefined,
        specialRequests: specialRequests || undefined,
        paymentMethod,
      });

      router.replace('/(tabs)/tracking/activity-bookings');
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, marginBottom: 12 }}
            accessibilityRole="button"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? theme.colors['text-dark'] : theme.colors.text}
            />
          </Pressable>

          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
            Book Activity
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {activitySpotName}
          </Text>
        </View>

        <View className="px-6 pb-6">
          {/* Booking Date */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Booking Date *
            </Text>
            <TextInput
              value={bookingDate}
              onChangeText={setBookingDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              style={{
                fontSize: 16,
              }}
            />
          </View>

          {/* Participant Count */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Number of Participants *
            </Text>
            <View className="flex-row items-center">
              <Pressable
                onPress={() => {
                  const count = parseInt(participantCount || '1', 10);
                  if (count > 1) setParticipantCount(String(count - 1));
                }}
                className="p-3 border rounded-l-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={isDark ? theme.colors['text-dark'] : theme.colors.text}
                />
              </Pressable>
              <TextInput
                value={participantCount}
                onChangeText={setParticipantCount}
                keyboardType="number-pad"
                className="flex-1 p-3 text-center border-t border-b text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
                style={{ fontSize: 16 }}
              />
              <Pressable
                onPress={() => {
                  const count = parseInt(participantCount || '1', 10);
                  setParticipantCount(String(count + 1));
                }}
                className="p-3 border rounded-r-xl bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={isDark ? theme.colors['text-dark'] : theme.colors.text}
                />
              </Pressable>
            </View>
          </View>

          {/* Special Requirements */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Special Requirements (Optional)
            </Text>
            <TextInput
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              placeholder="Dietary restrictions, accessibility needs, etc."
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              multiline
              numberOfLines={3}
              className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              style={{
                fontSize: 16,
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* Special Requests */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Special Requests (Optional)
            </Text>
            <TextInput
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any additional requests..."
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
              multiline
              numberOfLines={3}
              className="p-3 border rounded-xl text-text dark:text-text-dark bg-white dark:bg-surface-dark border-border dark:border-border-dark"
              style={{
                fontSize: 16,
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
              Payment Method
            </Text>
            <View className="flex-row gap-2">
              {(['sslcommerz', 'wallet', 'cash'] as const).map((method) => (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className="flex-1 p-3 border rounded-xl"
                  style={{
                    backgroundColor:
                      paymentMethod === method
                        ? isDark
                          ? theme.colors['primary-dark']
                          : theme.colors.primary
                        : isDark
                        ? theme.colors['surface-dark']
                        : '#ffffff',
                    borderColor:
                      paymentMethod === method
                        ? isDark
                          ? theme.colors['primary-dark']
                          : theme.colors.primary
                        : isDark
                        ? theme.colors['border-dark']
                        : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-center text-sm font-semibold"
                    style={{
                      color:
                        paymentMethod === method
                          ? '#ffffff'
                          : isDark
                          ? theme.colors['text-dark']
                          : theme.colors.text,
                    }}
                  >
                    {method === 'sslcommerz' ? 'Card' : method.charAt(0).toUpperCase() + method.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Price Summary */}
          <View className="p-4 mb-6 border rounded-xl bg-white dark:bg-surface-dark border-primary/20 dark:border-primary-dark/40">
            <Text className="text-xs font-semibold tracking-wide uppercase text-primary dark:text-primary-dark">
              Total Price
            </Text>
            <Text className="mt-3 text-3xl font-bold font-heading text-text dark:text-text-dark">
              ৳{totalPrice.toLocaleString()}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
              {participantCount} participant(s) × ৳{entryCost.toLocaleString()}
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className="p-4 rounded-xl"
            style={{
              backgroundColor:
                loading
                  ? isDark
                    ? theme.colors['muted-dark']
                    : theme.colors.muted
                  : isDark
                  ? theme.colors['primary-dark']
                  : theme.colors.primary,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-semibold text-center text-white">
                Confirm Booking
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
