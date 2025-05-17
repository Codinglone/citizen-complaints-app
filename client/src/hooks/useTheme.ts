import { useState, useEffect } from 'react';

type ThemeName = 'light' | 'dark' | 'synthwave';

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return { theme, toggleTheme, setTheme };
};