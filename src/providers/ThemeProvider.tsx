import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => Promise<void>;
  isDark: boolean;
};

const STORAGE_KEY = 'app_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored as ThemeMode);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    // keep in sync if user chooses system and OS changes
    // no-op here because useColorScheme will update isDark via memo
  }, [system]);

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

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
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
