import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTerminal } from '../hooks/useTerminal';
import AsciiHeader from '../components/AsciiArt/AsciiHeader';
import TerminalPrompt from '../components/Terminal/TerminalPrompt';
import MessageList from '../components/Terminal/MessageList';
import TerminalInput from '../components/Terminal/TerminalInput';
import TabCompletion from '../components/Terminal/TabCompletion';

const Home = () => {
  const { user, logout } = useAuth();
  const { messages, addMessage, commandHistory, currentCommandIndex, setCurrentCommandIndex, processCommand } = useTerminal();
  const [inputValue, setInputValue] = useState('');
  const [showTabCompletion, setShowTabCompletion] = useState(false);
  const [tabCompletionOptions, setTabCompletionOptions] = useState([]);
  const [tabCompletionIndex, setTabCompletionIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Display welcome message and ASCII art on load
    addMessage("Welcome to TermChat v1.0.0", "system");
    addMessage(<AsciiHeader />, "system");
    addMessage(`Logged in as ${user.username} | Current time: ${new Date().toLocaleString()}`, "system");
    addMessage("Type 'help' for available commands or 'lolcat' for rainbow text", "system");
    
    // Set focus to input
    inputRef.current?.focus();
    
    // Add keyboard event listener for the entire page
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowTabCompletion(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCommandHistory = (direction) => {
    if (commandHistory.length === 0) return;
    
    let newIndex;
    if (direction === 'up') {
      newIndex = currentCommandIndex > 0 ? currentCommandIndex - 1 : 0;
    } else {
      newIndex = currentCommandIndex < commandHistory.length - 1 ? currentCommandIndex + 1 : commandHistory.length;
    }
    
    setCurrentCommandIndex(newIndex);
    if (newIndex < commandHistory.length) {
      setInputValue(commandHistory[newIndex]);
    } else {
      setInputValue('');
    }
  };

  const handleTabCompletion = () => {
    if (inputValue.trim() === '') return;
    
    // Get available commands for completion
    const availableCommands = [
      'help', 'clear', 'logout', 'whatsapp', 'insta', 'chat', 'ascii', 
      'settings', 'lolcat', 'cowsay', 'fortune', 'matrix', 'user', 'theme'
    ];
    
    // Filter commands based on input
    const matchingCommands = availableCommands.filter(cmd => 
      cmd.startsWith(inputValue.split(' ').pop().toLowerCase())
    );
    
    if (matchingCommands.length === 1) {
      // If only one match, complete it directly
      const words = inputValue.split(' ');
      words[words.length - 1] = matchingCommands[0];
      setInputValue(words.join(' '));
      setShowTabCompletion(false);
    } else if (matchingCommands.length > 1) {
      // If multiple matches, show completion options
      setTabCompletionOptions(matchingCommands);
      setTabCompletionIndex(0);
      setShowTabCompletion(true);
    }
  };

  const selectTabCompletion = (option) => {
    const words = inputValue.split(' ');
    words[words.length - 1] = option;
    setInputValue(words.join(' '));
    setShowTabCompletion(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user input to messages
    addMessage(`${inputValue}`, "user");
    
    // Process the command
    processCommand(inputValue);
    
    // Clear input
    setInputValue('');
    setShowTabCompletion(false);
    
    // Reset command history index
    setCurrentCommandIndex(commandHistory.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleCommandHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleCommandHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'Escape') {
      setShowTabCompletion(false);
    } else if (showTabCompletion && e.key === 'ArrowDown') {
      e.preventDefault();
      setTabCompletionIndex((prev) => (prev + 1) % tabCompletionOptions.length);
    } else if (showTabCompletion && e.key === 'ArrowUp') {
      e.preventDefault();
      setTabCompletionIndex((prev) => (prev - 1 + tabCompletionOptions.length) % tabCompletionOptions.length);
    } else if (showTabCompletion && e.key === 'Enter') {
      e.preventDefault();
      selectTabCompletion(tabCompletionOptions[tabCompletionIndex]);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={() => logout()}></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize" onClick={() => navigate('/settings')}></div>
        </div>
        <div className="terminal-title">{user.username}@termchat:~</div>
      </div>
      
      <div className="terminal-body">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <TerminalPrompt username={user.username} />
          <TerminalInput 
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          
          {showTabCompletion && (
            <TabCompletion 
              options={tabCompletionOptions} 
              selectedIndex={tabCompletionIndex}
              onSelect={selectTabCompletion}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Home;