import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
