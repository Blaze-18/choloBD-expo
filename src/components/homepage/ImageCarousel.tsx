import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 32; // 16px margin on each side
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

const CAROUSEL_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop' },
  { id: 2, url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
];

export default function ImageCarousel() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const images = CAROUSEL_IMAGES;

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    resetAutoScroll();
  };

  const autoScroll = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    // Use setTimeout to batch state updates
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: nextIndex * CAROUSEL_WIDTH,
        animated: true,
      });
    }, 0);
  };

  const resetAutoScroll = () => {
    if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current as any);
      }
    autoScrollTimer.current = setTimeout(autoScroll, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current);
      }
    };
  }, [currentIndex]);

  return (
    <View className="px-4 py-6 bg-white dark:bg-neutral-950">
      {/* Carousel Container */}
      <View className="overflow-hidden bg-gray-200 rounded-2xl dark:bg-neutral-800">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ width: '100%' }}
        >
          {images.map((img) => (
            <View
              key={`carousel-image-${img.id}`}
              style={{ width: CAROUSEL_WIDTH }}
              className="h-56 overflow-hidden bg-gray-300 dark:bg-neutral-800 rounded-2xl"
            >
              <Image
                source={{ uri: img.url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Dots Indicator */}
      <View className="flex-row items-center justify-center gap-2 py-4">
        {images.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                index === currentIndex
                  ? '#2563eb'
                  : '#d1d5db',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
}
