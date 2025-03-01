import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TerminalProvider } from './context/TerminalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <TerminalProvider>
          <App />
        </TerminalProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);