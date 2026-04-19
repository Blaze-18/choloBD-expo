import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../providers/LanguageProvider';
import { Feather } from '@expo/vector-icons';
import SuggestedTourCard from './SuggestedTourCard';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface Tour {
  id: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  price: number;
  imageUrl: string;
}

const SUGGESTED_TOURS: Tour[] = [
  {
    id: '1',
    title: 'Mountain Adventure Trek',
    location: 'Himalayas',
    duration: '5 Days',
    rating: 4.8,
    price: 599,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Beach Paradise Escape',
    location: 'Maldives',
    duration: '3 Days',
    rating: 4.9,
    price: 799,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Cultural Heritage Tour',
    location: 'Nepal',
    duration: '4 Days',
    rating: 4.7,
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Wildlife Safari',
    location: 'Serengeti',
    duration: '6 Days',
    rating: 4.9,
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=400&fit=crop',
  },
];

export default function SuggestedToursSection() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const handleTourPress = (tour: Tour) => {
    console.log('Selected tour:', tour.id);
    // Navigate to tour detail page
    router.push('/explore');
  };

  const handleSeeAll = () => {
    router.push('/explore');
  };

  return (
    <View className="bg-white dark:bg-neutral-950 px-4 pt-8 pb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white flex-1">
            {t(TRANSLATION_KEYS.HOME.SUGGESTED_TOURS)}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 flex-1">
            {t(TRANSLATION_KEYS.HOME.SUGGESTED_TOURS_DESC)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSeeAll}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-2"
        >
          <Feather name="arrow-right" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tours Carousel */}
      <View className="py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
        {SUGGESTED_TOURS.map((tour) => (
          <SuggestedTourCard
            key={tour.id}
            id={tour.id}
            title={tour.title}
            location={tour.location}
            duration={tour.duration}
            rating={tour.rating}
            price={tour.price}
            imageUrl={tour.imageUrl}
            onPress={() => handleTourPress(tour)}
          />
        ))}
        </ScrollView>
      </View>

      {/* Bottom CTA */}
      <View className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4">
        <Text className="text-white font-bold text-base mb-2">
          Can't find what you're looking for?
        </Text>
        <Text className="text-white/90 text-sm">
          Browse all tours and create your custom itinerary
        </Text>
      </View>
    </View>
  );
}
