import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreHotelListUI } from '../../../components/ui/exploreHotelListUI';
import { useExplore } from './_provider';

export default function ExploreList() {
  const { hotels, hotelsLoading, selectHotel } = useExplore();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6 }}>
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">Available Hotels</Text>
        </View>

        <View className="px-6 pb-6">
          <ExploreHotelListUI hotels={hotels} loading={hotelsLoading} onSelectHotel={selectHotel} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
