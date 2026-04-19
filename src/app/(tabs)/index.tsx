import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../providers/LanguageProvider';
import { AppDispatch, RootState } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { HomeHeader, ImageCarousel, HeroSection, FeaturesGrid, SuggestedToursSection, NearbyLocationsSection } from '../../components/homepage';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);
  const { isDark } = useTheme();
  const { currentLanguage } = useLanguage();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/(auth)/login');
  };

  const handleNavigate = (section: string, item: string) => {
    console.log(`Navigating to ${section}/${item}`);
    // Navigation logic based on the item selected
    switch (item) {
      case 'explore':
        router.push('/explore');
        break;
      case 'bookings':
        router.push('/(tabs)/dashboard');
        break;
      case 'scan-qr':
        router.push('/(tabs)/dashboard/service-admin/qr-scanner');
        break;
      case 'wallet':
        router.push('/(shop)/wallet');
        break;
      case 'payment':
        router.push('/(shop)/payment');
        break;
      case 'track':
        router.push('/(tabs)/tracking');
        break;
      case 'profile':
        router.push('/(info)/activity-spots');
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
        {/* Image Carousel */}
        <ImageCarousel />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Suggested Tours */}
        <SuggestedToursSection />

        {/* Nearby Locations */}
        <NearbyLocationsSection />

        {/* Bottom Spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
