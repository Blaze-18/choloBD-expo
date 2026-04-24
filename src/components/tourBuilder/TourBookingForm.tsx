/**
 * Tour Booking Form Component
 * Form for purchasing a tour package
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface TourBookingFormProps {
  packageName: string;
  totalBudget: number;
  maxGroupSize?: number;
  quantity: number;
  setQuantity: (qty: number) => void;
  specialRequests: string;
  setSpecialRequests: (text: string) => void;
  notes: string;
  setNotes: (text: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function TourBookingForm({
  packageName,
  totalBudget,
  maxGroupSize,
  quantity,
  setQuantity,
  specialRequests,
  setSpecialRequests,
  notes,
  setNotes,
  onSubmit,
  submitting,
}: TourBookingFormProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const totalPrice = totalBudget * quantity;

  const handleIncrease = () => {
    if (maxGroupSize && quantity >= maxGroupSize) {
      return; // Don't exceed max group size
    }
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View>
      {/* Package Summary */}
      <View
        className="p-4 mb-6 rounded-xl"
        style={{ backgroundColor: surfaceColor, borderWidth: 1, borderColor }}
      >
        <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.PACKAGE_NAME)}
        </Text>
        <Text className="mt-1 text-lg font-bold text-text dark:text-text-dark">{packageName}</Text>
        <Text className="mt-3 text-sm font-semibold text-muted dark:text-muted-dark">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.PRICE_PER_PERSON)}
        </Text>
        <Text className="mt-1 text-lg font-bold text-text dark:text-text-dark">৳{totalBudget.toLocaleString()}</Text>
      </View>

      {/* Quantity Selector */}
      <View className="mb-6">
        <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.QUANTITY)} *
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleDecrease}
            disabled={quantity <= 1}
            className="items-center justify-center w-12 h-12 rounded-lg"
            style={{
              backgroundColor: quantity <= 1 ? (isDark ? '#333' : '#f0f0f0') : surfaceColor,
              borderWidth: 1,
              borderColor,
            }}
          >
            <Ionicons name="remove" size={24} color={quantity <= 1 ? mutedColor : primaryColor} />
          </TouchableOpacity>

          <View
            className="flex-1 items-center justify-center h-12 mx-3 rounded-lg"
            style={{ backgroundColor: surfaceColor, borderWidth: 1, borderColor }}
          >
            <Text className="text-xl font-bold text-text dark:text-text-dark">{quantity}</Text>
          </View>

          <TouchableOpacity
            onPress={handleIncrease}
            disabled={maxGroupSize ? quantity >= maxGroupSize : false}
            className="items-center justify-center w-12 h-12 rounded-lg"
            style={{
              backgroundColor:
                maxGroupSize && quantity >= maxGroupSize ? (isDark ? '#333' : '#f0f0f0') : surfaceColor,
              borderWidth: 1,
              borderColor,
            }}
          >
            <Ionicons
              name="add"
              size={24}
              color={maxGroupSize && quantity >= maxGroupSize ? mutedColor : primaryColor}
            />
          </TouchableOpacity>
        </View>
        {maxGroupSize && (
          <Text className="mt-2 text-xs text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.PACKAGE_BOOKING.MAX_GROUP_SIZE)}: {maxGroupSize}
          </Text>
        )}
      </View>

      {/* Special Requests */}
      <View className="mb-6">
        <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.SPECIAL_REQUESTS)}{' '}
          <Text className="font-normal text-muted dark:text-muted-dark">
            ({t(TRANSLATION_KEYS.BOOKING.OPTIONAL)})
          </Text>
        </Text>
        <TextInput
          value={specialRequests}
          onChangeText={setSpecialRequests}
          placeholder={t(TRANSLATION_KEYS.PACKAGE_BOOKING.SPECIAL_REQUESTS_PLACEHOLDER)}
          placeholderTextColor={mutedColor}
          multiline
          numberOfLines={3}
          className="p-3 text-sm rounded-lg text-text dark:text-text-dark"
          style={{
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
        />
      </View>

      {/* Additional Notes */}
      <View className="mb-6">
        <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.NOTES)}{' '}
          <Text className="font-normal text-muted dark:text-muted-dark">
            ({t(TRANSLATION_KEYS.BOOKING.OPTIONAL)})
          </Text>
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={t(TRANSLATION_KEYS.PACKAGE_BOOKING.NOTES_PLACEHOLDER)}
          placeholderTextColor={mutedColor}
          multiline
          numberOfLines={3}
          className="p-3 text-sm rounded-lg text-text dark:text-text-dark"
          style={{
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
        />
      </View>

      {/* Total Price */}
      <View
        className="p-4 mb-6 rounded-xl"
        style={{ backgroundColor: `${primaryColor}15`, borderWidth: 1, borderColor: `${primaryColor}40` }}
      >
        <Text className="text-sm font-semibold" style={{ color: primaryColor }}>
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.TOTAL_PRICE)}
        </Text>
        <Text className="mt-1 text-3xl font-bold" style={{ color: primaryColor }}>
          ৳{totalPrice.toLocaleString()}
        </Text>
        <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
          ৳{totalBudget.toLocaleString()} × {quantity} {quantity === 1 ? 'person' : 'people'}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitting}
        className="flex-row items-center justify-center p-4 rounded-xl"
        style={{ backgroundColor: submitting ? mutedColor : primaryColor }}
        activeOpacity={0.8}
      >
        {submitting ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text className="ml-2 text-base font-bold text-white">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.PROCESSING)}...
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text className="text-base font-bold text-white">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.CONFIRM_PURCHASE)}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
