import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreHotelDetailUI } from '../../../components/ui/exploreHotelDetailUI';
import { useExplore } from './_provider';
import { useRouter } from 'expo-router';

export default function ExploreDetail() {
  const { hotelDetail, detailLoading } = useExplore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!hotelDetail) return null;

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ExploreHotelDetailUI
        hotel={hotelDetail}
        onBack={() => router.back()}
        onBackToSearch={() => router.push('/(tabs)/explore')}
        onBooking={() => router.push('/(tabs)/explore/booking')}
        loading={detailLoading}
      />
    </SafeAreaView>
  );
}
