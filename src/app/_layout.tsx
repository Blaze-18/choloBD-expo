import './globals.css';
import { Stack, useRouter } from 'expo-router';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useAuthInitializer } from '../hooks/state/useAuthInitializer';
import { usePreloadAssets } from '../hooks/usePreloadAssets';
import { API_BASE_URL } from '../constants/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SplashScreen as CustomSplash } from '../components/splash';
import { useState, useEffect } from 'react';

function AppContentStack() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

function AppContentLayout() {
  useAuthInitializer(API_BASE_URL);
  const { isReady: assetsReady } = usePreloadAssets();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (assetsReady && splashDone) {
      // Hide native splash when custom splash is done
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [assetsReady, splashDone]);

  // Show custom splash while preloading
  if (!assetsReady) {
    return (
      <CustomSplash delay={0} /> // Show splash indefinitely until assets ready
    );
  }

  // Show custom splash with fade-out transition
  if (!splashDone) {
    return (
      <CustomSplash
        delay={2500}
        onComplete={() => setSplashDone(true)}
      />
    );
  }

  // App is ready, show main content
  return (
    <SafeAreaProvider>
      <AppContentStack />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <ThemeProvider>
      <AppContentLayout />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}