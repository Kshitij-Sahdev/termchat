import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-green');
  
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('termchat_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('termchat_theme', newTheme);
    
    // Play theme change sound if available
    const audio = new Audio('/sounds/theme-change.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};