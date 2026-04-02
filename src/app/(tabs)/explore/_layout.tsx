import React from 'react';
import { Stack } from 'expo-router';
import { ExploreProvider } from './_provider';

export default function ExploreLayout() {
  return (
    <ExploreProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ExploreProvider>
  );
}
