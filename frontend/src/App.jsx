import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Home from './pages/Home';
import Login from './pages/Login';
import Settings from './pages/Settings';
import './styles/TerminalUI.css';
import './styles/animations.css';
import './styles/themes.css';
import ScanLine from './components/UI/ScanLine';

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Add terminal startup sound
    const audio = new Audio('/sounds/terminal-startup.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  }, []);

  if (loading) {
    return (
      <div className={`terminal loading-screen ${theme}`}>
        <div className="loading-container">
          <pre className="loading-ascii">
            {`
   _______
  |.-----.|
  ||x . x||  TermChat
  ||_.-._||   Loading...
  \`--)-(--\`
  __[=== o]___
 |::::::::::::|\\
 \`-=========-\`()
            `}
          </pre>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="loading-text">Initializing system... Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={theme}>
        <ScanLine />
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;