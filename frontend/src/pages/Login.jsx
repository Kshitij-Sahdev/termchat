import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AsciiHeader from '../components/AsciiArt/AsciiHeader';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, error } = useAuth();

  useEffect(() => {
    const typeWriterEffect = (text, element, delay = 50) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, delay);
    };

    const titleElement = document.getElementById('login-title');
    if (titleElement) {
      titleElement.textContent = '';
      typeWriterEffect('Access Terminal / Enter Credentials', titleElement);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      await register(username, password);
    } else {
      await login(username, password);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">Authentication Terminal</div>
      </div>
      
      <div className="terminal-body login-container">
        <AsciiHeader />
        
        <h2 id="login-title" className="login-header"></h2>
        
        {error && <div className="message message-error">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isRegistering ? 'Register' : 'Login'}
            </button>
            <button 
              type="button" 
              className="btn btn-link" 
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Back to Login' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <pre className="ascii-small">
            {`
[TermChat v1.0.0]
System ready.
`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Login;