import { useCallback } from 'react';
import { useThemeContext } from '../providers/ThemeProvider';

export const useTheme = () => {
  const { mode, setMode, isDark } = useThemeContext();

  const toggle = useCallback(async () => {
    if (mode === 'dark') await setMode('light');
    else await setMode('dark');
  }, [mode, setMode]);

  // include system so consumers can reflect provider's view
  // @ts-ignore
  const { system } = useThemeContext();

  return { mode, setMode, isDark, system, toggle } as const;
};

export default useTheme;
