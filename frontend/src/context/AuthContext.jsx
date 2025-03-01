import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('termchat_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (username, password) => {
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, allow any login with password longer than 3 chars
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      displayName: username,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('termchat_user', JSON.stringify(newUser));
    
    // Play terminal login sound
    const audio = new Audio('/sounds/terminal-login.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };
  
  const register = async (username, password) => {
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      displayName: username,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('termchat_user', JSON.stringify(newUser));
    
    // Play terminal sound
    const audio = new Audio('/sounds/terminal-register.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('termchat_user');
    
    // Play terminal logout sound
    const audio = new Audio('/sounds/terminal-logout.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };
  
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('termchat_user', JSON.stringify(updatedUser));
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      register, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};