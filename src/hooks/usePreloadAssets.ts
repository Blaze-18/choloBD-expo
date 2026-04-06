import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

/**
 * Hook to preload all necessary assets (fonts, images, API data, etc.)
 * Returns ready state so parent can know when to hide splash screen
 */
export const usePreloadAssets = () => {
  const [isReady, setIsReady] = useState(false);

  // Preload fonts
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed
    // 'CustomFont': require('../../assets/fonts/CustomFont.ttf'),
  });

  useEffect(() => {
    const preload = async () => {
      try {
        // Prevent splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Pre-warm session or auth data if needed
        // e.g., check for stored auth token
        const storedAuth = await SecureStore.getItemAsync('auth_token').catch(() => null);

        // Simulate minimal startup tasks (can add more as needed)
        // For now, just ensure fonts are loaded
        if (fontsLoaded) {
          setIsReady(true);
        }
      } catch (e) {
        console.error('[usePreloadAssets] Error during preload:', e);
        // Allow app to proceed even if preload fails
        setIsReady(true);
      }
    };

    preload();
  }, [fontsLoaded]);

  return { isReady, fontsLoaded };
};

export default usePreloadAssets;
