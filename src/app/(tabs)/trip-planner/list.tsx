/**
 * Trip Planner List Screen
 * Shows all user trips
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTripPlannerLogic } from '../../../hooks/useTripPlannerLogic';

console.log('[TripPlannerList] Screen loaded');

export default function TripPlannerList() {
  const router = useRouter();
  const { trips, isTripsLoading, tripsError, loadTrips, deleteTrip } = useTripPlannerLogic();

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

  const handleDeleteTrip = (tripId: string, tripName: string) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${tripName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTrip(tripId),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
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
          className="p-3 rounded-full bg-primary"
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isTripsLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : tripsError ? (
        <View className="items-center justify-center flex-1 px-6">
          <Text className="mb-4 text-center text-error dark:text-error-dark">
            {tripsError.message}
          </Text>
          <TouchableOpacity
            onPress={() => loadTrips()}
            className="px-6 py-3 rounded-lg bg-primary"
          >
            <Text className="font-semibold text-onPrimary">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : trips.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <Feather name="map" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">
            No trips yet
          </Text>
          <Text className="mt-2 text-center text-muted dark:text-muted-dark">
            Create your first trip to get started
          </Text>
          <TouchableOpacity
            onPress={handleCreateNew}
            className="px-8 py-3 mt-6 rounded-lg bg-primary"
          >
            <Text className="font-semibold text-onPrimary">Create Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pb-6" showsVerticalScrollIndicator={false}>
          {trips.map((trip) => (
            <View
              key={trip.id}
              className="flex-row items-stretch mb-4 overflow-hidden border rounded-lg bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
            >
              {/* Tappable main area */}
              <TouchableOpacity
                onPress={() => handleTripPress(trip.id)}
                activeOpacity={0.7}
                className="flex-1 p-4"
              >
                <Text className="text-lg font-bold text-text dark:text-text-dark">
                  {trip.name}
                </Text>
                <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
                  {trip.primaryLocation.name}
                </Text>
                <View className="flex-row items-center mt-3">
                  <View className="px-3 py-1 rounded bg-primary/10 dark:bg-primary-dark/10">
                    <Text className="text-xs font-semibold text-primary dark:text-primary-dark">
                      {trip.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Delete button — separate, no nesting */}
              <TouchableOpacity
                onPress={() => handleDeleteTrip(trip.id, trip.name)}
                activeOpacity={0.7}
                className="items-center justify-center px-4 border-l border-border dark:border-border-dark"
              >
                <Feather name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
