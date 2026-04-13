/**
 * Date Range Selection Window Component
 * Second sliding window - Select trip dates
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface DateRangeSelectionProps {
  onDateRangeSelected: (startDate: Date, endDate: Date) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
}

/**
 * DateRangeSelection Component
 */
export function DateRangeSelection({
  onDateRangeSelected,
  selectedStartDate,
  selectedEndDate,
}: DateRangeSelectionProps) {
  const [startDate, setStartDate] = useState<Date>(selectedStartDate || new Date());
  const [endDate, setEndDate] = useState<Date>(
    selectedEndDate || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: any, date?: Date) => {
    if (date) {
      setStartDate(date);
      setShowStartPicker(false);
      // Ensure end date is after start date
      if (date > endDate) {
        setEndDate(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
      }
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    if (date) {
      if (date > startDate) {
        setEndDate(date);
      }
      setShowEndPicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  };

  const handleContinue = () => {
    onDateRangeSelected(startDate, endDate);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
          When are you going?
        </Text>
        <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
          Select your travel dates
        </Text>
      </View>

      {/* Date Selection Cards */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Start Date */}
        <View className="mt-4 mb-4">
          <Text className="text-sm font-semibold text-text dark:text-text-dark mb-2">
            Start Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-xs text-muted dark:text-muted-dark">From</Text>
              <Text className="text-lg font-semibold text-text dark:text-text-dark mt-1">
                {formatDate(startDate)}
              </Text>
            </View>
            <Feather name="calendar" size={20} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="spinner"
            onChange={handleStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-text dark:text-text-dark mb-2">
            End Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-xs text-muted dark:text-muted-dark">To</Text>
              <Text className="text-lg font-semibold text-text dark:text-text-dark mt-1">
                {formatDate(endDate)}
              </Text>
            </View>
            <Feather name="calendar" size={20} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="spinner"
            onChange={handleEndDateChange}
            minimumDate={startDate}
          />
        )}

        {/* Trip Duration */}
        <View className="bg-primary/10 dark:bg-primary-dark/10 border border-primary dark:border-primary-dark rounded-lg p-4 mb-6">
          <View className="flex-row items-center">
            <Feather name="info" size={20} color="#0066FF" />
            <Text className="ml-3 text-primary dark:text-primary-dark font-semibold">
              {calculateDays()} days trip
            </Text>
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-primary rounded-lg py-4 items-center"
        >
          <Text className="text-onPrimary font-bold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DateRangeSelection;
