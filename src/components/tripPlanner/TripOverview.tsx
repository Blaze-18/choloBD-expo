/**
 * Trip Overview Component
 * Displays trip summary: dates, duration, location, participants, budget, status
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TripPlan } from '../../types/trips';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface TripOverviewProps {
  trip: TripPlan;
}

export function TripOverview({ trip }: TripOverviewProps) {
  const { isDark } = useTheme();
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;

  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Format dates
  const startDateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDateStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

  // Status badge color
  const getStatusColor = () => {
    switch (trip.status) {
      case 'PLANNING':
        return '#3B82F6';
      case 'SAVED':
        return primaryColor;
      case 'BOOKED':
        return successColor;
      case 'IN_PROGRESS':
        return '#F59E0B';
      case 'COMPLETED':
        return '#10B981';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <View className="px-6">
      {/* Trip Title and Location */}
      <View className="mb-4">
        <Text className="text-sm text-muted dark:text-muted-dark">Location</Text>
        <Text className="text-lg font-semibold text-text dark:text-text-dark mt-1">
          {trip.primaryLocation?.name || 'Unknown'}
        </Text>
      </View>

      {/* Trip Info Grid */}
      <View className="flex-row gap-3 mb-4">
        {/* Duration */}
        <View className="flex-1 bg-surface dark:bg-surface-dark rounded-lg p-3">
          <View className="flex-row items-center mb-1">
            <Feather name="calendar" size={14} color={primaryColor} />
            <Text className="text-xs text-muted dark:text-muted-dark ml-1">Duration</Text>
          </View>
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            {duration} {duration === 1 ? 'Day' : 'Days'}
          </Text>
        </View>

        {/* Participants */}
        <View className="flex-1 bg-surface dark:bg-surface-dark rounded-lg p-3">
          <View className="flex-row items-center mb-1">
            <Feather name="users" size={14} color={successColor} />
            <Text className="text-xs text-muted dark:text-muted-dark ml-1">Participants</Text>
          </View>
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            {trip.participantCount}
          </Text>
        </View>
      </View>

      {/* Dates */}
      <View className="bg-surface dark:bg-surface-dark rounded-lg p-3 mb-4">
        <View className="flex-row items-center mb-1">
          <Feather name="clock" size={14} color={primaryColor} />
          <Text className="text-xs text-muted dark:text-muted-dark ml-1">Travel Dates</Text>
        </View>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">
          {startDateStr} - {endDateStr}
        </Text>
      </View>

      {/* Budget and Status */}
      <View className="flex-row gap-3">
        {/* Budget */}
        <View className="flex-1 bg-surface dark:bg-surface-dark rounded-lg p-3">
          <View className="flex-row items-center mb-1">
            <Feather name="dollar-sign" size={14} color={primaryColor} />
            <Text className="text-xs text-muted dark:text-muted-dark ml-1">Est. Budget</Text>
          </View>
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            {trip.estimatedBudget ? `₹${trip.estimatedBudget}` : 'Not set'}
          </Text>
        </View>

        {/* Status */}
        <View className="flex-1 bg-surface dark:bg-surface-dark rounded-lg p-3 items-center justify-center">
          <View
            style={{
              backgroundColor: getStatusColor(),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              className="text-xs font-semibold text-white"
              style={{ textTransform: 'uppercase' }}
            >
              {trip.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
