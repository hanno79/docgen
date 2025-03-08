import React, { createContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Prüfe, ob ein Theme im localStorage gespeichert ist, sonst verwende das System-Theme
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    // Prüfe System-Präferenz
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Aktualisiere das Theme im localStorage und im HTML-Element
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Aktualisiere das HTML-Element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
