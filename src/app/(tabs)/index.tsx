import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { AppDispatch, RootState } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import {
  HomeHeader,
  HeroBackground,
  QuickActionGrid,
  ExploreBDBanner,
  TourPackagesSection,
  SuggestedToursSection,
} from '../../components/homepage';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);
  const { isDark } = useTheme();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/(auth)/login');
  };

  const handleNavigate = (section: string, item: string) => {
    console.log(`Navigating to ${section}/${item}`);
    // Navigation logic based on the item selected
    switch (item) {
      case 'explore':
        router.push('/(tabs)/explore');
        break;
      case 'bookings':
        router.push('/(tabs)/dashboard');
        break;
      case 'activity':
        router.push('/(tabs)/explore/tour-spots-list');
        break;
      case 'tours':
        router.push('/(tabs)/explore/tour-list');
        break;
      case 'scan-qr':
        router.push('/(tabs)/dashboard/service-admin/qr-scanner');
        break;
      case 'wallet':
        Alert.alert('Coming Soon', 'Wallet feature is not yet available in this version.');
        break;
      case 'payment':
        Alert.alert('Coming Soon', 'Payment feature is not yet available in this version.');
        break;
      case 'track':
        router.push('/(tabs)/tracking');
        break;
      case 'profile':
        router.push('/(tabs)/dashboard');
        break;
      case 'settings':
        Alert.alert('Info', 'Settings page is not yet available.');
        break;
      case 'help':
        Alert.alert('Help', 'Help page is not yet available.');
        break;
      case 'about':
        Alert.alert('About', 'About page is not yet available.');
        break;
      default:
        console.log('Navigation not implemented for:', item);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <HomeHeader onNavigate={handleNavigate} onLogout={handleLogout} />

      {/* Main Content */}
      <ScrollView className="flex-1 bg-background dark:bg-background-dark" showsVerticalScrollIndicator={false}>
        {/* 1. Hero Background with messaging */}
        <HeroBackground />

        {/* 2. Quick Action Grid */}
        <QuickActionGrid onNavigate={(actionId) => console.log('Quick action pressed:', actionId)} />

        {/* 3. Explore BD Banner */}
        <ExploreBDBanner />

        {/* 4. Tour Packages */}
        <TourPackagesSection />

        {/* 4. Hot Deals / Suggested Tours */}
        <SuggestedToursSection />

        {/* Bottom Spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
