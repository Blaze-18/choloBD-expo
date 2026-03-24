import { useCallback } from 'react';
import { useThemeContext } from '../providers/ThemeProvider';

export const useTheme = () => {
  const { mode, setMode, isDark } = useThemeContext();

  const toggle = useCallback(async () => {
    if (mode === 'dark') await setMode('light');
    else await setMode('dark');
  }, [mode, setMode]);

  return { mode, setMode, isDark, toggle } as const;
};

export default useTheme;
