import React from 'react';
import { Image } from 'react-native';

interface AppBrandSectionProps {
  width?: number;
  height?: number;
}

export default function AppBrandSection({ width = 200, height = 100 }: AppBrandSectionProps) {
  return (
    <Image
      source={require('../../assets/splash/splash.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
