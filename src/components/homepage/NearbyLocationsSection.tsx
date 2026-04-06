import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import LocationCard from './LocationCard';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface Location {
  id: string;
  title: string;
  type: 'hotel' | 'spot';
  rating: number;
  reviews: number;
  distance: string;
  imageUrl: string;
}

const NEARBY_LOCATIONS: Location[] = [
  {
    id: '1',
    title: 'The Grand Palace Hotel',
    type: 'hotel',
    rating: 4.8,
    reviews: 324,
    distance: '0.8 km away',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Ancient Temple Ruins',
    type: 'spot',
    rating: 4.9,
    reviews: 567,
    distance: '1.2 km away',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Sunset Beach Resort',
    type: 'hotel',
    rating: 4.7,
    reviews: 289,
    distance: '2.1 km away',
    imageUrl: 'https://images.unsplash.com/photo-1564501049351-8c-c94b20e38d?w=500&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Mountain Viewpoint',
    type: 'spot',
    rating: 4.6,
    reviews: 412,
    distance: '3.5 km away',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop',
  },
];

export default function NearbyLocationsSection() {
  const router = useRouter();
  const { isDark } = useTheme();

  const handleLocationPress = (location: Location) => {
    console.log('Selected location:', location.id);
    if (location.type === 'hotel') {
      router.push('/explore');
    } else {
      router.push('/explore');
    }
  };

  const handleExploreAll = () => {
    router.push('/explore');
  };

  return (
    <View className="bg-white dark:bg-neutral-950 px-4 py-12">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            Explore Nearby
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Top hotels & attractions near you
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleExploreAll}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-2"
        >
          <Feather name="arrow-right" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Locations Grid */}
      <View>
        {/* Row 1 */}
        <View className="flex-row gap-4 mb-4">
          <LocationCard
            id={NEARBY_LOCATIONS[0].id}
            title={NEARBY_LOCATIONS[0].title}
            type={NEARBY_LOCATIONS[0].type}
            rating={NEARBY_LOCATIONS[0].rating}
            reviews={NEARBY_LOCATIONS[0].reviews}
            distance={NEARBY_LOCATIONS[0].distance}
            imageUrl={NEARBY_LOCATIONS[0].imageUrl}
            onPress={() => handleLocationPress(NEARBY_LOCATIONS[0])}
          />
          <LocationCard
            id={NEARBY_LOCATIONS[1].id}
            title={NEARBY_LOCATIONS[1].title}
            type={NEARBY_LOCATIONS[1].type}
            rating={NEARBY_LOCATIONS[1].rating}
            reviews={NEARBY_LOCATIONS[1].reviews}
            distance={NEARBY_LOCATIONS[1].distance}
            imageUrl={NEARBY_LOCATIONS[1].imageUrl}
            onPress={() => handleLocationPress(NEARBY_LOCATIONS[1])}
          />
        </View>

        {/* Row 2 */}
        <View className="flex-row gap-4">
          <LocationCard
            id={NEARBY_LOCATIONS[2].id}
            title={NEARBY_LOCATIONS[2].title}
            type={NEARBY_LOCATIONS[2].type}
            rating={NEARBY_LOCATIONS[2].rating}
            reviews={NEARBY_LOCATIONS[2].reviews}
            distance={NEARBY_LOCATIONS[2].distance}
            imageUrl={NEARBY_LOCATIONS[2].imageUrl}
            onPress={() => handleLocationPress(NEARBY_LOCATIONS[2])}
          />
          <LocationCard
            id={NEARBY_LOCATIONS[3].id}
            title={NEARBY_LOCATIONS[3].title}
            type={NEARBY_LOCATIONS[3].type}
            rating={NEARBY_LOCATIONS[3].rating}
            reviews={NEARBY_LOCATIONS[3].reviews}
            distance={NEARBY_LOCATIONS[3].distance}
            imageUrl={NEARBY_LOCATIONS[3].imageUrl}
            onPress={() => handleLocationPress(NEARBY_LOCATIONS[3])}
          />
        </View>
      </View>

      {/* Info Banner */}
      <View className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <View className="flex-row items-start gap-3">
          <Feather name="info" size={20} color={theme.colors.primary} />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-1">
              Location Services
            </Text>
            <Text className="text-xs text-blue-800 dark:text-blue-300">
              Locations are based on your last known position. Enable location services for real-time updates.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
