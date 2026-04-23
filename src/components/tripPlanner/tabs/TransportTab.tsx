/**
 * Transport Tab Component
 * Display and manage transport bookings
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { TripPlan } from '../../../types/trips';

interface TransportTabProps {
  trip: TripPlan;
}

export function TransportTab({ trip }: TransportTabProps) {
  const { t } = useTranslation();
  const transportCount = trip.userSegments?.filter((s) => s.transportBookingId).length || 0;

  return (
    <View>
      {transportCount > 0 ? (
        <View>
          <Text className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.TRIP_PLANNER.TRANSPORT_BOOKING_COUNT, { count: transportCount, plural: transportCount !== 1 ? 's' : '' })}
          </Text>
          {trip.userSegments
            ?.filter((s) => s.transportDetails)
            .map((segment) => (
              <View
                key={segment.id}
                className="p-4 mb-3 border rounded-lg bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Feather name="truck" size={14} color="#0066FF" />
                      <Text className="ml-2 font-semibold text-text dark:text-text-dark">
                        {segment.transportDetails?.name || 'Transport'}
                      </Text>
                    </View>
                    <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
                      Day {segment.dayNumber}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-text dark:text-text-dark">
                      ₹{segment.transportDetails?.cost || 0}
                    </Text>
                    <View
                      className="px-2 py-1 mt-1 rounded"
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
          <Text className="mt-3 text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.TRIP_PLANNER.TRANSPORT_EMPTY_TITLE)}</Text>
          <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.TRIP_PLANNER.TRANSPORT_EMPTY_SUBTITLE)}
          </Text>
        </View>
      )}
    </View>
  );
}
