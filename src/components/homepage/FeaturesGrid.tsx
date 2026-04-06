import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import FeatureCard from './FeatureCard';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof import('@expo/vector-icons').Feather.glyphMap;
  variant: 'primary' | 'secondary' | 'accent';
  route?: string;
}

const FEATURES: Feature[] = [
  {
    id: 'smart-tours',
    title: 'Smart Tours',
    description: 'Auto plan, quick tweaks',
    icon: 'map',
    variant: 'primary',
    route: '/explore',
  },
  {
    id: 'hotel-book',
    title: 'Hotel Book',
    description: 'Trusted stays, easy pay',
    icon: 'home',
    variant: 'secondary',
    route: '/explore',
  },
  {
    id: 'ride-tickets',
    title: 'Ride Tickets',
    description: 'Bus, train, air',
    icon: 'truck',
    variant: 'accent',
    route: '/explore',
  },
  {
    id: 'find-buddies',
    title: 'Find Buddies',
    description: 'Meet travel friends',
    icon: 'users',
    variant: 'primary',
    route: '/explore',
  },
  {
    id: 'wallet-deals',
    title: 'Wallet & Deals',
    description: 'Cashback and perks',
    icon: 'credit-card',
    variant: 'secondary',
    route: '/(shop)/wallet',
  },
  {
    id: 'local-guides',
    title: 'Local Guides',
    description: 'Tips from pros',
    icon: 'compass',
    variant: 'accent',
    route: '/explore',
  },
];

export default function FeaturesGrid() {
  const router = useRouter();

  const handleFeaturePress = (feature: Feature) => {
    if (feature.route) {
      router.push(feature.route);
    }
  };

  return (
    <View className="bg-white dark:bg-neutral-950 px-4 py-6">
      <View className="gap-4">
        {/* Row 1 */}
        <View className="flex-row gap-4">
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[0].title}
              description={FEATURES[0].description}
              icon={FEATURES[0].icon}
              variant={FEATURES[0].variant}
              onPress={() => handleFeaturePress(FEATURES[0])}
            />
          </View>
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[1].title}
              description={FEATURES[1].description}
              icon={FEATURES[1].icon}
              variant={FEATURES[1].variant}
              onPress={() => handleFeaturePress(FEATURES[1])}
            />
          </View>
        </View>

        {/* Row 2 */}
        <View className="flex-row gap-4">
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[2].title}
              description={FEATURES[2].description}
              icon={FEATURES[2].icon}
              variant={FEATURES[2].variant}
              onPress={() => handleFeaturePress(FEATURES[2])}
            />
          </View>
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[3].title}
              description={FEATURES[3].description}
              icon={FEATURES[3].icon}
              variant={FEATURES[3].variant}
              onPress={() => handleFeaturePress(FEATURES[3])}
            />
          </View>
        </View>

        {/* Row 3 */}
        <View className="flex-row gap-4">
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[4].title}
              description={FEATURES[4].description}
              icon={FEATURES[4].icon}
              variant={FEATURES[4].variant}
              onPress={() => handleFeaturePress(FEATURES[4])}
            />
          </View>
          <View className="flex-1">
            <FeatureCard
              title={FEATURES[5].title}
              description={FEATURES[5].description}
              icon={FEATURES[5].icon}
              variant={FEATURES[5].variant}
              onPress={() => handleFeaturePress(FEATURES[5])}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
