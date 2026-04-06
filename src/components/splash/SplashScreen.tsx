import React from 'react';
import { View, Image, Animated, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface SplashScreenProps {
  onComplete?: () => void;
  delay?: number; // Delay before auto-completing (ms)
}

/**
 * Custom branded splash screen with rounded image
 * Shows logo centered on a theme-aware background
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, delay = 2000 }) => {
  const { isDark } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!delay || delay <= 0) return;

    const fadeOutTimer = setTimeout(() => {
      // Fade out the splash screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onComplete?.();
      });
    }, delay - 400); // Start fade 400ms before delay ends

    return () => clearTimeout(fadeOutTimer);
  }, [delay, fadeAnim, onComplete]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? theme.colors['background-dark'] : theme.colors.background,
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Centered rounded logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/splash/splash.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Optional branding text or tagline */}
      <View style={styles.bottomSection}>
        <Text style={styles.tagline}>Your all in one travel planner</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 240,
    marginBottom: 60,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 40, // Rounded corners (adjust as needed)
    overflow: 'hidden',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
