import React from 'react';
import { Image } from 'react-native';

interface AppBrandSectionProps {
  width?: number;
  height?: number;
}

export default function AppBrandSection({ width = 160, height = 80 }: AppBrandSectionProps) {
  return (
    <Image
      source={require('../../assets/splash/splash.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
