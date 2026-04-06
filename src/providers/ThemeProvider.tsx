import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => Promise<void>;
  isDark: boolean;
  system: string | null;
};

const STORAGE_KEY = 'app_theme_mode';
// Set to true to force the app into dark mode regardless of system/user setting.
// Temporary: remove or set to false when no longer needed.
const FORCE_DARK = false;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [system, setSystem] = useState<string | null>(Appearance.getColorScheme());
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (FORCE_DARK) {
          setModeState('dark');
        } else {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored === 'light' || stored === 'dark' || stored === 'system') {
            setModeState(stored as ThemeMode);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    // keep in sync with system appearance changes
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme);
    });
    return () => {
      // subscription may provide remove()
      // @ts-ignore
      if (typeof sub.remove === 'function') sub.remove();
    };
  }, []);

  const setMode = async (m: ThemeMode) => {
    try {
      if (m === 'system') {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, m);
      }
    } catch (e) {
      // ignore
    }
    setModeState(m);
  };

  const isDark = useMemo(() => {
    if (mode === 'system') return system === 'dark';
    return mode === 'dark';
  }, [mode, system]);

  // For NativeWind, apply the `dark` class at the root View

  if (!isReady) {
    return (
      <View style={{ flex: 1 }} />
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark, system }}>
      <View style={{ flex: 1 }} className={isDark ? 'dark' : ''}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
