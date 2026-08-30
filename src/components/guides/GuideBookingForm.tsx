/**
 * Guide Booking Form Component
 * Collects the schedule, party size and payment preference for a guide request
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { DatePickerInput } from '../ui/DatePickerInput';
import { Guide, GuideAvailabilityResult, GuidePaymentMethod } from '../../types/guides';
import { SubmitGuideBookingInput } from '../../hooks/useGuideBookingLogic';

interface GuideBookingFormProps {
  guide: Guide;
  submitting?: boolean;
  availability?: GuideAvailabilityResult | null;
  availabilityLoading?: boolean;
  onCheckAvailability: (params: { bookingDate: string; endTime: string; startTime?: string }) => void;
  onSubmit: (input: SubmitGuideBookingInput) => void;
}

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

const PAYMENT_METHODS: GuidePaymentMethod[] = ['sslcommerz', 'wallet', 'cash'];

const MAX_TRAVELERS = 20;

/**
 * Combines a YYYY-MM-DD date and an HH:MM time into a UTC ISO string.
 * UTC is pinned deliberately so the day the traveler picked survives the
 * round trip regardless of device timezone.
 */
function toIsoDateTime(date: string, time?: string): string {
  return `${date}T${time ?? '00:00'}:00.000Z`;
}

/**
 * Mirrors the backend price rule: a day rate, billed in 8-hour blocks when a
 * start time is supplied.
 */
function estimateTotalPrice(pricePerDay: number, date: string, startTime?: string, endTime?: string): number {
  if (!date || !startTime || !endTime) return pricePerDay;

  const start = new Date(toIsoDateTime(date, startTime)).getTime();
  const end = new Date(toIsoDateTime(date, endTime)).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return pricePerDay;

  const durationHours = (end - start) / (1000 * 60 * 60);
  const billedDays = Math.max(1, Math.ceil(durationHours / 8));
  return pricePerDay * billedDays;
}

export function GuideBookingForm({
  guide,
  submitting = false,
  availability,
  availabilityLoading = false,
  onCheckAvailability,
  onSubmit,
}: GuideBookingFormProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const chipIdleColor = isDark ? '#374151' : '#f3f4f6';

  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState<string | undefined>(guide.requiresStartTime ? '09:00' : undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [travelerCount, setTravelerCount] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<GuidePaymentMethod>('sslcommerz');

  const today = new Date().toISOString().slice(0, 10);

  const validationError = useMemo(() => {
    if (!bookingDate) return t(TRANSLATION_KEYS.GUIDE_BOOKING.VALIDATION_DATE);
    if (!endTime) return t(TRANSLATION_KEYS.GUIDE_BOOKING.VALIDATION_END_TIME);
    if (guide.requiresStartTime && !startTime) return t(TRANSLATION_KEYS.GUIDE_BOOKING.VALIDATION_START_TIME);
    if (startTime && endTime <= startTime) return t(TRANSLATION_KEYS.GUIDE_BOOKING.VALIDATION_TIME_ORDER);
    return null;
  }, [bookingDate, startTime, endTime, guide.requiresStartTime, t]);

  // Re-check availability whenever the requested window becomes valid
  useEffect(() => {
    if (validationError) return;
    onCheckAvailability({
      bookingDate: toIsoDateTime(bookingDate),
      endTime: toIsoDateTime(bookingDate, endTime),
      startTime: startTime ? toIsoDateTime(bookingDate, startTime) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDate, startTime, endTime, validationError]);

  const estimatedTotal = estimateTotalPrice(guide.pricePerDay, bookingDate, startTime, endTime);

  const isUnavailable = availability?.available === false;
  const canSubmit = !validationError && !submitting && !isUnavailable;

  const handleSubmit = () => {
    if (!canSubmit || !bookingDate || !endTime) return;

    onSubmit({
      guideId: guide.id,
      bookingDate: toIsoDateTime(bookingDate),
      endTime: toIsoDateTime(bookingDate, endTime),
      startTime: startTime ? toIsoDateTime(bookingDate, startTime) : undefined,
      travelerCount,
      specialRequirements: specialRequirements.trim() || undefined,
      specialRequests: specialRequests.trim() || undefined,
      paymentMethod,
    });
  };

  const renderTimeRow = (
    label: string,
    value: string | undefined,
    onSelect: (time: string) => void,
    optional?: boolean
  ) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginBottom: 8 }}>
        {label}
        {optional ? <Text style={{ color: mutedColor, fontWeight: '400' }}> ({t(TRANSLATION_KEYS.GUIDE_BOOKING.OPTIONAL)})</Text> : null}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            onPress={() => onSelect(slot)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor: value === slot ? primaryColor : chipIdleColor,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: value === slot ? '#fff' : textColor }}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Guide summary */}
      <View
        style={{
          backgroundColor: surfaceColor,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>
          {guide.firstName} {guide.lastName}
        </Text>
        {guide.location?.name ? (
          <Text style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>{guide.location.name}</Text>
        ) : null}
        <Text style={{ fontSize: 15, fontWeight: '700', color: primaryColor, marginTop: 8 }}>
          ৳{guide.pricePerDay?.toLocaleString()} / {t(TRANSLATION_KEYS.GUIDES.PER_DAY)}
        </Text>
      </View>

      {/* Date */}
      <DatePickerInput
        label={t(TRANSLATION_KEYS.GUIDE_BOOKING.DATE)}
        value={bookingDate}
        onChange={setBookingDate}
        minDate={today}
        placeholder={t(TRANSLATION_KEYS.GUIDE_BOOKING.SELECT_DATE)}
      />

      {/* Times */}
      {renderTimeRow(
        t(TRANSLATION_KEYS.GUIDE_BOOKING.START_TIME),
        startTime,
        setStartTime,
        !guide.requiresStartTime
      )}
      {renderTimeRow(t(TRANSLATION_KEYS.GUIDE_BOOKING.END_TIME), endTime, (time) => setEndTime(time))}

      {/* Travelers */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginBottom: 8 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.TRAVELERS)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setTravelerCount((c) => Math.max(1, c - 1))}
            disabled={travelerCount <= 1}
            style={{ opacity: travelerCount <= 1 ? 0.4 : 1 }}
          >
            <Ionicons name="remove-circle-outline" size={26} color={primaryColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>{travelerCount}</Text>
          <TouchableOpacity
            onPress={() => setTravelerCount((c) => Math.min(MAX_TRAVELERS, c + 1))}
            disabled={travelerCount >= MAX_TRAVELERS}
            style={{ opacity: travelerCount >= MAX_TRAVELERS ? 0.4 : 1 }}
          >
            <Ionicons name="add-circle-outline" size={26} color={primaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment method */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginBottom: 8 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.PAYMENT_METHOD)}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setPaymentMethod(method)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: paymentMethod === method ? primaryColor : chipIdleColor,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: paymentMethod === method ? '#fff' : textColor }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.PAYMENT_METHODS[method.toUpperCase() as 'SSLCOMMERZ' | 'WALLET' | 'CASH'])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special requirements */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginBottom: 8 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUIREMENTS)}
        </Text>
        <TextInput
          value={specialRequirements}
          onChangeText={setSpecialRequirements}
          placeholder={t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUIREMENTS_PLACEHOLDER)}
          placeholderTextColor={mutedColor}
          multiline
          maxLength={500}
          style={{
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 10,
            padding: 12,
            minHeight: 80,
            textAlignVertical: 'top',
            color: textColor,
          }}
        />
      </View>

      {/* Special requests */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: textColor, marginBottom: 8 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUESTS)}
        </Text>
        <TextInput
          value={specialRequests}
          onChangeText={setSpecialRequests}
          placeholder={t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUESTS_PLACEHOLDER)}
          placeholderTextColor={mutedColor}
          multiline
          maxLength={500}
          style={{
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 10,
            padding: 12,
            minHeight: 80,
            textAlignVertical: 'top',
            color: textColor,
          }}
        />
      </View>

      {/* Availability feedback */}
      {availabilityLoading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={{ fontSize: 13, color: mutedColor }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.CHECKING_AVAILABILITY)}
          </Text>
        </View>
      ) : availability ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
            backgroundColor: availability.available ? `${successColor}1A` : `${errorColor}1A`,
          }}
        >
          <Ionicons
            name={availability.available ? 'checkmark-circle' : 'close-circle'}
            size={18}
            color={availability.available ? successColor : errorColor}
          />
          <Text style={{ fontSize: 13, flex: 1, color: availability.available ? successColor : errorColor }}>
            {availability.available
              ? t(TRANSLATION_KEYS.GUIDE_BOOKING.AVAILABLE)
              : availability.reason || t(TRANSLATION_KEYS.GUIDE_BOOKING.UNAVAILABLE)}
          </Text>
        </View>
      ) : null}

      {/* Price estimate */}
      <View
        style={{
          backgroundColor: surfaceColor,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.ESTIMATED_TOTAL)}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: primaryColor }}>
            ৳{estimatedTotal.toLocaleString()}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: mutedColor, marginTop: 6, lineHeight: 17 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.PRICE_NOTE)}
        </Text>
      </View>

      {/* Validation message */}
      {validationError ? (
        <Text style={{ fontSize: 13, color: errorColor, marginBottom: 12 }}>{validationError}</Text>
      ) : null}

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!canSubmit}
        style={{
          paddingVertical: 15,
          borderRadius: 14,
          alignItems: 'center',
          backgroundColor: canSubmit ? primaryColor : isDark ? '#374151' : '#e5e7eb',
        }}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ fontSize: 16, fontWeight: '700', color: canSubmit ? '#fff' : mutedColor }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.SUBMIT_REQUEST)}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: mutedColor, textAlign: 'center', marginTop: 12, lineHeight: 17 }}>
        {t(TRANSLATION_KEYS.GUIDE_BOOKING.ACCEPTANCE_NOTE)}
      </Text>
    </ScrollView>
  );
}
