/**
 * Admin Explore Interface Component
 * Displays explore options for service admin users
 */

import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ExploreMainCard } from '../explore/ExploreMainCard';
import { TourBuilderCard } from '../tourBuilder/TourBuilderCard';

console.log('[AdminExploreInterface] Component loaded');

export function AdminExploreInterface() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBookHotel = () => {
    console.log('[AdminExploreInterface] Navigating to hotel search');
    router.push('/(tabs)/explore/hotel-search');
  };

  const handleBrowseTours = () => {
    console.log('[AdminExploreInterface] Navigating to tour list (admin)');
    router.push('/(tabs)/explore/tour-list');
  };

  const handleCreateTours = () => {
    console.log('[AdminExploreInterface] Navigating to tour creation');
    router.push('/(tabs)/explore/tour-create');
  };

  const handleMyTours = () => {
    console.log('[AdminExploreInterface] Navigating to my tours');
    router.push('/(tabs)/explore/my-tours');
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">
            Explore & Manage
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
            Manage hotels and tour packages
          </Text>
        </View>

        <View className="px-6 pb-6">
          <ExploreMainCard
            title="Book a Hotel"
            description="Find and book your perfect stay"
            iconName="bed"
            colorKey="primary"
            onPress={handleBookHotel}
          />

          <ExploreMainCard
            title="Browse Tours"
            description="View all tour packages"
            iconName="map"
            colorKey="success"
            onPress={handleBrowseTours}
          />

          <TourBuilderCard
            subtitle="Design and publish new tour packages for guests"
            onPress={handleCreateTours}
          />

          <ExploreMainCard
            title="My Tours"
            description="View all your created tour packages"
            iconName="list"
            colorKey="warning"
            onPress={handleMyTours}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AdminExploreInterface;
