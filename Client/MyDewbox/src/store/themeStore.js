import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document root using data-theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        // Add smooth transition class
        document.documentElement.style.transition = 'background-color 300ms ease-in-out, color 300ms ease-in-out';
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        // Apply theme to document root using data-theme attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        // Add smooth transition class
        document.documentElement.style.transition = 'background-color 300ms ease-in-out, color 300ms ease-in-out';
        return { theme: newTheme };
      }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on initial load
        const theme = state?.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
      },
    }
  )
);
