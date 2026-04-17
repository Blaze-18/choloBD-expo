import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ExploreMainCard } from './ExploreMainCard';
import { TourBuilderCard } from '../tourBuilder/TourBuilderCard';

interface ExploreInterfaceProps {
  isAdmin?: boolean;
}

export function ExploreInterface({ isAdmin = false }: ExploreInterfaceProps) {
  const router = useRouter();

  const handleBookHotel = () => router.push('/(tabs)/explore/hotel-search');
  const handleBrowseTours = () => router.push('/(tabs)/explore/tour-list');
  const handleCreateTripPlan = () => router.push('/(tabs)/trip-planner');
  const handleCreateTours = () => router.push('/(tabs)/explore/tour-create');
  const handleMyTours = () => router.push('/(tabs)/explore/my-tours');

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">
            {isAdmin ? 'Explore & Manage' : 'Explore'}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
            {isAdmin
              ? 'Manage hotels and tour packages'
              : 'Discover amazing hotels and tours'}
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
            description={isAdmin ? 'View all tour packages' : 'Explore exciting tour packages'}
            iconName="map"
            colorKey="success"
            onPress={handleBrowseTours}
          />

          {isAdmin ? (
            <>
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
            </>
          ) : (
            <ExploreMainCard
              title="Plan Your Trip"
              description="Create a custom trip itinerary"
              iconName="compass"
              colorKey="accent"
              onPress={handleCreateTripPlan}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ExploreInterface;
