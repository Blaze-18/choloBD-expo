/**
 * Trip Planner List Screen
 * Shows all user trips
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTripPlannerLogic } from '../../../hooks/useTripPlannerLogic';

console.log('[TripPlannerList] Screen loaded');

export default function TripPlannerList() {
  const router = useRouter();
  const { trips, isTripsLoading, tripsError, loadTrips } = useTripPlannerLogic();

  useEffect(() => {
    loadTrips();
  }, []);

  const handleCreateNew = () => {
    console.log('[TripPlannerList] Creating new trip');
    router.push('/(tabs)/trip-planner/create');
  };

  const handleTripPress = (tripId: string) => {
    console.log('[TripPlannerList] Opening trip:', tripId);
    router.push(`/(tabs)/trip-planner/${tripId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">
            My Trips
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            Manage your travel plans
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCreateNew}
          className="bg-primary rounded-full p-3"
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isTripsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : tripsError ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-center text-error dark:text-error-dark mb-4">
            {tripsError.message}
          </Text>
          <TouchableOpacity
            onPress={() => loadTrips()}
            className="px-6 py-3 bg-primary rounded-lg"
          >
            <Text className="text-onPrimary font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : trips.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="map" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">
            No trips yet
          </Text>
          <Text className="mt-2 text-center text-muted dark:text-muted-dark">
            Create your first trip to get started
          </Text>
          <TouchableOpacity
            onPress={handleCreateNew}
            className="mt-6 px-8 py-3 bg-primary rounded-lg"
          >
            <Text className="text-onPrimary font-semibold">Create Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pb-6" showsVerticalScrollIndicator={false}>
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => handleTripPress(trip.id)}
              className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-4 mb-4"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-text dark:text-text-dark">
                    {trip.name}
                  </Text>
                  <Text className="text-xs text-muted dark:text-muted-dark mt-1">
                    {trip.primaryLocation.name}
                  </Text>
                  <View className="mt-3 flex-row items-center">
                    <View className="bg-primary/10 dark:bg-primary-dark/10 px-3 py-1 rounded">
                      <Text className="text-xs font-semibold text-primary dark:text-primary-dark">
                        {trip.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <Feather name="chevron-right" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
