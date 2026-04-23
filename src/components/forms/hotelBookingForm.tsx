import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface HotelBookingFormProps {
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  setGuestName: (text: string) => void;
  setGuestEmail: (text: string) => void;
  setGuestPhoneNumber: (text: string) => void;
  paymentMethod?: string;
  setPaymentMethod?: (text: string) => void;
  specialRequests?: string;
  setSpecialRequests?: (text: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function HotelBookingForm({
  checkInDate,
  checkOutDate,
  guestName,
  guestEmail,
  guestPhoneNumber,
  setGuestName,
  setGuestEmail,
  setGuestPhoneNumber,
  paymentMethod,
  setPaymentMethod,
  specialRequests,
  setSpecialRequests,
  onSubmit,
  submitting,
  isEditing = false,
  onCancel,
}: HotelBookingFormProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  return (
    <View className="mt-6 space-y-4">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark">
        {isEditing ? t(TRANSLATION_KEYS.BOOKING.EDIT_BOOKING) : t(TRANSLATION_KEYS.BOOKING.BOOKING_DETAILS)}
      </Text>

      {/* Dates Display (Read-only - selected during search) */}
      <View className="p-4 rounded-lg bg-primary/5 dark:bg-primary-dark/10 border border-primary/20 dark:border-primary-dark/30">
        <Text className="text-xs font-semibold text-primary dark:text-primary-dark mb-2 uppercase">
          {t(TRANSLATION_KEYS.BOOKING.CHECK_IN)} - {t(TRANSLATION_KEYS.BOOKING.CHECK_OUT)}
        </Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar" size={16} color={isDark ? theme.colors['primary-dark'] : theme.colors.primary} />
          <Text className="text-sm font-semibold text-text dark:text-text-dark">
            {checkInDate || t(TRANSLATION_KEYS.BOOKING.NOT_SET)} → {checkOutDate || t(TRANSLATION_KEYS.BOOKING.NOT_SET)}
          </Text>
        </View>
        <Text className="text-xs text-muted dark:text-muted-dark mt-2">
          {t(TRANSLATION_KEYS.BOOKING.DATES_SELECTED_DURING_SEARCH)}
        </Text>
      </View>

      {/* Guest Name */}
      {!isEditing && (
        <View>
          <Text className="text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.GUEST_NAME)}</Text>
          <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
            <Ionicons name="person" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
            <TextInput
              value={guestName}
              onChangeText={setGuestName}
              placeholder={t(TRANSLATION_KEYS.BOOKING.GUEST_NAME_PLACEHOLDER)}
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
              className="flex-1 p-3 text-text dark:text-text-dark"
            />
          </View>
        </View>
      )}

      {/* Guest Email */}
      {!isEditing && (
        <View>
          <Text className="text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.EMAIL)}</Text>
          <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
            <Ionicons name="mail" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
            <TextInput
              value={guestEmail}
              onChangeText={setGuestEmail}
              placeholder={t(TRANSLATION_KEYS.BOOKING.EMAIL_PLACEHOLDER)}
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
              keyboardType="email-address"
              className="flex-1 p-3 text-text dark:text-text-dark"
            />
          </View>
        </View>
      )}

      {/* Guest Phone */}
      {!isEditing && (
        <View>
          <Text className="text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.PHONE_NUMBER)}</Text>
          <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
            <Ionicons name="call" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
            <TextInput
              value={guestPhoneNumber}
              onChangeText={setGuestPhoneNumber}
              placeholder={t(TRANSLATION_KEYS.BOOKING.PHONE_PLACEHOLDER)}
              placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
              keyboardType="phone-pad"
              className="flex-1 p-3 text-text dark:text-text-dark"
            />
          </View>
        </View>
      )}

      {/* Payment Method */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.PAYMENT_METHOD)} ({t(TRANSLATION_KEYS.BOOKING.OPTIONAL)})</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="card" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            placeholder={t(TRANSLATION_KEYS.BOOKING.PAYMENT_METHOD_PLACEHOLDER)}
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Special Requests */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.SPECIAL_REQUESTS)} ({t(TRANSLATION_KEYS.BOOKING.OPTIONAL)})</Text>
        <View className="mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <TextInput
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder={t(TRANSLATION_KEYS.BOOKING.SPECIAL_REQUESTS_PLACEHOLDER)}
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            multiline
            numberOfLines={3}
            className="p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Submit Button */}
      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting}
          style={{
            flex: 1,
            backgroundColor: submitting 
              ? (isDark ? theme.colors['surface-2-dark'] : '#e5e7eb')
              : isEditing
              ? (isDark ? theme.colors['primary-dark'] : theme.colors.primary)
              : (isDark ? theme.colors['success-light-dark'] : theme.colors['success-light']),
            borderRadius: 12,
            minHeight: 52,
            paddingVertical: 16,
          }}
        >
          <Text style={{ 
            color: submitting ? (isDark ? theme.colors['muted-dark'] : theme.colors.muted) : '#ffffff', 
            fontWeight: '600', 
            textAlign: 'center' 
          }}>
            {submitting 
              ? (isEditing ? t(TRANSLATION_KEYS.BOOKING.SAVING_BOOKING) : t(TRANSLATION_KEYS.BOOKING.CREATING_BOOKING))
              : (isEditing ? t(TRANSLATION_KEYS.BOOKING.SAVE_CHANGES) : t(TRANSLATION_KEYS.BOOKING.CREATE_BOOKING))
            }
          </Text>
        </TouchableOpacity>

        {isEditing && onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            disabled={submitting}
            style={{
              flex: 1,
              backgroundColor: isDark ? theme.colors['surface-2-dark'] : '#e5e7eb',
              borderRadius: 12,
              minHeight: 52,
              paddingVertical: 16,
            }}
          >
            <Text style={{ 
              color: isDark ? theme.colors['text-dark'] : theme.colors.text, 
              fontWeight: '600', 
              textAlign: 'center' 
            }}>
              {t(TRANSLATION_KEYS.BOOKING.CANCEL_EDIT)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
