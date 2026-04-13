/**
 * Transport Tab Component
 * Display and manage transport bookings
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TripPlan } from '../../../types/trips';

interface TransportTabProps {
  trip: TripPlan;
}

export function TransportTab({ trip }: TransportTabProps) {
  const transportCount = trip.userSegments?.filter((s) => s.transportBookingId).length || 0;

  return (
    <View>
      {transportCount > 0 ? (
        <View>
          <Text className="text-sm font-semibold text-text dark:text-text-dark mb-4">
            {transportCount} Transport Booking{transportCount !== 1 ? 's' : ''}
          </Text>
          {trip.userSegments
            ?.filter((s) => s.transportDetails)
            .map((segment) => (
              <View
                key={segment.id}
                className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-3 border border-border dark:border-border-dark"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Feather name="truck" size={14} color="#0066FF" />
                      <Text className="font-semibold text-text dark:text-text-dark ml-2">
                        {segment.transportDetails?.name || 'Transport'}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted dark:text-muted-dark mt-1">
                      Day {segment.dayNumber}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-text dark:text-text-dark">
                      ₹{segment.transportDetails?.cost || 0}
                    </Text>
                    <View
                      className="mt-1 px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          segment.transportDetails?.bookingStatus === 'CONFIRMED'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color:
                            segment.transportDetails?.bookingStatus === 'CONFIRMED'
                              ? '#0066FF'
                              : '#F59E0B',
                        }}
                      >
                        {segment.transportDetails?.bookingStatus || 'PENDING'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      ) : (
        <View className="items-center justify-center py-8">
          <Feather name="truck" size={40} color="#D1D5DB" />
          <Text className="text-muted dark:text-muted-dark mt-3">No transport booked yet</Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-1">
            Add transport for your journey
          </Text>
        </View>
      )}
    </View>
  );
}
