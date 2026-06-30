import React from 'react';
import { Image } from 'react-native';

interface AppBrandSectionProps {
  width?: number;
  height?: number;
}

export default function AppBrandSection({ width = 130, height = 52 }: AppBrandSectionProps) {
  return (
    <Image
      source={require('../../assets/splash/splash.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
