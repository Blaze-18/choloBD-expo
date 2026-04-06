import React from 'react';
import { View, Text } from 'react-native';

export default function HeroSection() {
  return (
    <View className="bg-white dark:bg-neutral-950 px-6 py-12">
      {/* Main Title */}
      <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 text-center italic">
        Everything For Your Next Trip
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-neutral-600 dark:text-neutral-400 text-center leading-6 font-light">
        Suggest tours, build custom plans, book stays & rides, and meet buddies
      </Text>
    </View>
  );
}
