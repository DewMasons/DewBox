import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

/**
 * Hook to initialize theme on app load
 * Applies the persisted theme from localStorage to the document
 */
export const useThemeInit = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Apply theme to document root on mount and when theme changes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
};
