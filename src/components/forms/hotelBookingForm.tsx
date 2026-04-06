import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface HotelBookingFormProps {
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  setCheckInDate: (text: string) => void;
  setCheckOutDate: (text: string) => void;
  setGuestName: (text: string) => void;
  setGuestEmail: (text: string) => void;
  setGuestPhoneNumber: (text: string) => void;
  paymentMethod?: string;
  setPaymentMethod?: (text: string) => void;
  specialRequests?: string;
  setSpecialRequests?: (text: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function HotelBookingForm({
  checkInDate,
  checkOutDate,
  guestName,
  guestEmail,
  guestPhoneNumber,
  setCheckInDate,
  setCheckOutDate,
  setGuestName,
  setGuestEmail,
  setGuestPhoneNumber,
  paymentMethod,
  setPaymentMethod,
  specialRequests,
  setSpecialRequests,
  onSubmit,
  submitting,
}: HotelBookingFormProps) {
  const { isDark } = useTheme();
  return (
    <View className="mt-6 space-y-4">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark">Booking Details</Text>

      {/* Check-in Date */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Check-in Date</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="calendar" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={checkInDate}
            onChangeText={setCheckInDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Check-out Date */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Check-out Date</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="calendar" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={checkOutDate}
            onChangeText={setCheckOutDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Name */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Guest Name</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="person" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Jane Doe"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Email */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Email</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="mail" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={guestEmail}
            onChangeText={setGuestEmail}
            placeholder="jane@example.com"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            keyboardType="email-address"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Phone */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Phone Number</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="call" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={guestPhoneNumber}
            onChangeText={setGuestPhoneNumber}
            placeholder="+8801..."
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            keyboardType="phone-pad"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Payment Method */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Payment Method (optional)</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="card" size={18} color={isDark ? theme.colors['muted-dark'] : theme.colors.muted} style={{ marginLeft: 10 }} />
          <TextInput
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            placeholder="wallet | sslcommerz | cash"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Special Requests */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Special Requests (optional)</Text>
        <View className="mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <TextInput
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder="Any special requests"
            placeholderTextColor={isDark ? theme.colors['muted-dark'] : '#999'}
            multiline
            numberOfLines={3}
            className="p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? (isDark ? theme.colors['surface-2-dark'] : '#e5e7eb') : (isDark ? theme.colors['success-light-dark'] : theme.colors['success-light']),
          borderRadius: 8,
          marginTop: 24,
          paddingVertical: 16,
        }}
      >
        <Text style={{ color: submitting ? (isDark ? theme.colors['muted-dark'] : theme.colors.muted) : '#ffffff', fontWeight: '600', textAlign: 'center' }}>
          {submitting ? 'Creating Booking...' : 'Create Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
