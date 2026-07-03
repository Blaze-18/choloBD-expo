import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
}

export function DatePickerInput({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
}: DatePickerInputProps) {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : minDate ? new Date(minDate) : new Date()
  );

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const bgColor = isDark ? theme.colors['background-dark'] : theme.colors.background;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return placeholder;
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    // Format as YYYY-MM-DD using local date (not UTC)
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const date = String(selected.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${date}`;
    onChange(dateString);
    setShowModal(false);
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const min = new Date(minDate);
    return date < min;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const valueDate = new Date(value);
    return (
      date.getFullYear() === valueDate.getFullYear() &&
      date.getMonth() === valueDate.getMonth() &&
      date.getDate() === valueDate.getDate()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View
          key={`empty-${i}`}
          className="p-2 items-center justify-center rounded-lg"
        />
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);

      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => !disabled && handleDateSelect(day)}
          disabled={disabled}
          className="p-2 items-center justify-center rounded-lg"
          style={{
            opacity: disabled ? 0.3 : 1,
            backgroundColor: selected ? primaryColor : 'transparent',
          }}
        >
          <Text
            className={`font-semibold ${selected ? 'text-white' : 'text-text dark:text-text-dark'}`}
            style={{
              color: selected ? 'white' : textColor,
            }}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
        {label}
      </Text>

      {/* Date Display Button */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="flex-row items-center border rounded-lg px-3 py-3"
        style={{
          borderColor,
          backgroundColor: surfaceColor,
          borderWidth: 1,
        }}
      >
        <Ionicons name="calendar" size={18} color={primaryColor} />
        <Text
          className="flex-1 ml-2 font-medium"
          style={{
            color: value ? textColor : mutedColor,
          }}
        >
          {formatDate(value)}
        </Text>
        <Ionicons name="chevron-down" size={18} color={mutedColor} />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView
          className="flex-1"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            className="rounded-2xl p-6 w-11/12 max-w-sm"
            style={{ backgroundColor: surfaceColor }}
          >
            {/* Header with Month/Year and Navigation */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={handlePrevMonth}>
                <Ionicons name="chevron-back" size={24} color={primaryColor} />
              </TouchableOpacity>

              <Text
                className="text-lg font-bold"
                style={{ color: textColor }}
              >
                {monthYear}
              </Text>

              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={24} color={primaryColor} />
              </TouchableOpacity>
            </View>

            {/* Days of Week Header */}
            <View className="flex-row mb-3 justify-between">
              {daysOfWeek.map((day) => (
                <Text
                  key={day}
                  className="text-xs font-semibold text-center"
                  style={{
                    color: mutedColor,
                    flex: 1,
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap justify-between mb-6">
              {renderCalendar().map((cell, index) => (
                <View key={index} style={{ width: '14.28%', marginBottom: 8 }}>
                  {cell}
                </View>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="p-3 rounded-lg items-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="font-semibold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
