import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <View className="mt-6 space-y-4">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark">Booking Details</Text>

      {/* Check-in Date */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Check-in Date</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="calendar" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={checkInDate}
            onChangeText={setCheckInDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Check-out Date */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Check-out Date</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="calendar" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={checkOutDate}
            onChangeText={setCheckOutDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Name */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Guest Name</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="person" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Jane Doe"
            placeholderTextColor="#999"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Email */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Email</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="mail" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={guestEmail}
            onChangeText={setGuestEmail}
            placeholder="jane@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Guest Phone */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Phone Number</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="call" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={guestPhoneNumber}
            onChangeText={setGuestPhoneNumber}
            placeholder="+8801..."
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            className="flex-1 p-3 text-text dark:text-text-dark"
          />
        </View>
      </View>

      {/* Payment Method */}
      <View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">Payment Method (optional)</Text>
        <View className="flex-row items-center mt-2 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
          <Ionicons name="card" size={18} color="#666" style={{ marginLeft: 10 }} />
          <TextInput
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            placeholder="wallet | sslcommerz | cash"
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
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
        className={`p-4 mt-6 rounded-lg ${submitting ? 'bg-gray-400' : 'bg-primary dark:bg-primary-dark'}`}
      >
        <Text className="font-semibold text-center text-white">
          {submitting ? 'Creating Booking...' : 'Create Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
