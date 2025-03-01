import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { theme, changeTheme } = useTheme();
  const { user } = useAuth();
  const [terminalFont, setTerminalFont] = useState('Fira Code');
  const [fontSize, setFontSize] = useState('16px');
  const [asciiArtSet, setAsciiArtSet] = useState('classic');
  const [terminalSounds, setTerminalSounds] = useState(true);
  const [showScanLines, setShowScanLines] = useState(true);
  const navigate = useNavigate();

  const themeOptions = [
    { id: 'theme-green', name: 'Green (Default)' },
    { id: 'theme-blue', name: 'Blue Cyber' },
    { id: 'theme-amber', name: 'Amber Retro' },
    { id: 'theme-matrix', name: 'Matrix' },
    { id: 'theme-hacker', name: 'Hacker Dark' },
    { id: 'theme-lolcat', name: 'Rainbow (lolcat)' },
  ];

  const fontOptions = [
    'Fira Code', 'IBM Plex Mono', 'Ubuntu Mono', 'Courier New', 'Consolas'
  ];

  const sizeOptions = [
    '12px', '14px', '16px', '18px', '20px'
  ];

  const asciiArtOptions = [
    { id: 'classic', name: 'Classic Computer' },
    { id: 'animals', name: 'ASCII Animals' },
    { id: 'symbols', name: 'Hacker Symbols' },
    { id: 'custom', name: 'Custom Uploads' },
  ];

  const handleSave = () => {
    // Save settings to localStorage or API
    document.documentElement.style.setProperty('--font-family', terminalFont);
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--scan-line-display', showScanLines ? 'block' : 'none');
    
    // Navigate back to home
    navigate('/');
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={() => navigate('/')}></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">Terminal Settings</div>
      </div>
      
      <div className="terminal-body">
        <div className="settings-container">
          <h2 className="settings-header">System Configuration</h2>
          <pre className="ascii-small">
            {`
 _____       _   _   _                 
/  ___|     | | | | (_)                
\\ \`--.  ___ | |_| |_ _ _ __   __ _ ___ 
 \`--. \\/ _ \\| __| __| | '_ \\ / _\` / __|
/\\__/ / (_) | |_| |_| | | | | (_| \\__ \\
\\____/ \\___/ \\__|\\__|_|_| |_|\\__, |___/
                              __/ |    
                             |___/     
            `}
          </pre>
          
          <div className="settings-section">
            <h3>Display Theme</h3>
            <div className="theme-options">
              {themeOptions.map(option => (
                <div 
                  key={option.id}
                  className={`theme-option ${theme === option.id ? 'active' : ''}`}
                  onClick={() => changeTheme(option.id)}
                >
                  <div className={`theme-preview ${option.id}`}></div>
                  <span>{option.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Terminal Font</h3>
            <select 
              value={terminalFont}
              onChange={(e) => setTerminalFont(e.target.value)}
              className="settings-select"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            
            <h3>Font Size</h3>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="settings-select"
            >
              {sizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            
            <h3>ASCII Art Style</h3>
            <div className="ascii-options">
              {asciiArtOptions.map(option => (
                <div 
                  key={option.id}
                  className={`ascii-option ${asciiArtSet === option.id ? 'active' : ''}`}
                  onClick={() => setAsciiArtSet(option.id)}
                >
                  {option.name}
                </div>
              ))}
            </div>
            
            <h3>Effects</h3>
            <div className="settings-checkbox">
              <input 
                type="checkbox" 
                id="terminal-sounds" 
                checked={terminalSounds}
                onChange={() => setTerminalSounds(!terminalSounds)} 
              />
              <label htmlFor="terminal-sounds">Terminal Sounds</label>
            </div>
            
            <div className="settings-checkbox">
              <input 
                type="checkbox" 
                id="scan-lines" 
                checked={showScanLines}
                onChange={() => setShowScanLines(!showScanLines)} 
              />
              <label htmlFor="scan-lines">CRT Scan Lines</label>
            </div>
          </div>
          
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Settings
            </button>
            <button className="btn" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;