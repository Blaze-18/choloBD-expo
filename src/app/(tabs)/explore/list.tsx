import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { HotelListUI } from '../../../components/ui/hotelListUI';
import { useExplore } from './_provider';

export default function ExploreList() {
  const { hotels, hotelsLoading, selectHotel } = useExplore();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">Available Hotels</Text>
        </View>

        <View className="px-6 pb-6">
          <HotelListUI hotels={hotels} loading={hotelsLoading} onSelectHotel={selectHotel} showImages showPrice />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
