import React, { createContext, useState, useEffect } from 'react';
import WhatsAppConnector from '../services/WhatsAppConnector';
import InstagramConnector from '../services/InstagramConnector';
import ChatService from '../services/ChatService';
import AsciiGenerator from '../components/AsciiArt/AsciiGenerator';

export const TerminalContext = createContext();

export const TerminalProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [lolcatMode, setLolcatMode] = useState(false);
  
  // Initialize services
  const whatsAppConnector = new WhatsAppConnector(addMessage);
  const instagramConnector = new InstagramConnector(addMessage);
  const chatService = new ChatService(addMessage);
  
  useEffect(() => {
    // Load command history from localStorage
    const savedHistory = localStorage.getItem('termchat_command_history');
    if (savedHistory) {
      try {
        setCommandHistory(JSON.parse(savedHistory));
        setCurrentCommandIndex(JSON.parse(savedHistory).length);
      } catch (e) {
        console.error('Error loading command history', e);
      }
    }
  }, []);
  
  function addMessage(content, type = 'default') {
    setMessages(prevMessages => [...prevMessages, { content, type, timestamp: new Date().toISOString() }]);
  }
  
  const processCommand = (input) => {
    // Add to command history if not empty and differs from the last command
    if (input && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== input)) {
      const newHistory = [...commandHistory, input];
      setCommandHistory(newHistory);
      setCurrentCommandIndex(newHistory.length);
      
      // Save to localStorage (max 50 commands)
      localStorage.setItem('termchat_command_history', JSON.stringify(
        newHistory.slice(-50)
      ));
    }
    
    // Split command and arguments
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();
    const parameters = args.slice(1);
    
    // Process terminal-wide commands first
    switch (command) {
      case 'help':
        showHelp();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'lolcat':
        toggleLolcat(parameters.join(' ') || 'Rainbow text activated!');
        break;
      case 'cowsay':
        showCowsay(parameters.join(' ') || 'Moo!');
        break;
      case 'fortune':
        showFortune();
        break;
      case 'matrix':
        showMatrix();
        break;
      case 'whatsapp':
        whatsAppConnector.handleCommand(parameters);
        break;
      case 'insta':
      case 'ig':
        instagramConnector.handleCommand(parameters);
        break;
      case 'chat':
        chatService.handleCommand(parameters);
        break;
      case 'settings':
        window.location.href = '/settings';
        break;
      case 'logout':
        // This will be handled by the AuthContext
        window.location.href = '/login';
        break;
      default:
        addMessage(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
    }
    
    // Play key sound
    const audio = new Audio('/sounds/terminal-key.mp3');
    audio.volume = 0.1;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };
  
  const showHelp = () => {
    const helpText = `
Available commands:
  help                 - Show this help message
  clear                - Clear the terminal
  settings             - Open settings page
  logout               - Log out of terminal
  
Chat Integration:
  whatsapp connect     - Connect to WhatsApp
  whatsapp status      - Check WhatsApp connection status
  whatsapp send <to> <message> - Send WhatsApp message
  insta connect        - Connect to Instagram
  insta status         - Check Instagram connection status
  insta dm <user> <message> - Send Instagram direct message
  chat list            - List available chat rooms
  chat join <id>       - Join a chat room
  chat send <message>  - Send message to current chat
  
Terminal Fun:
  lolcat <text>        - Display rainbow colored text
  cowsay <text>        - Make an ASCII cow say something
  fortune              - Get a random fortune
  matrix               - Display Matrix animation
    `;
    addMessage(helpText, 'system');
  };
  
  const clearTerminal = () => {
    setMessages([]);
    addMessage('Terminal cleared.', 'system');
  };
  
  const toggleLolcat = (text) => {
    setLolcatMode(!lolcatMode);
    if (lolcatMode) {
      addMessage('Rainbow text mode deactivated.', 'system');
    } else {
      addMessage(<AsciiGenerator type="cat" text={text} rainbow />, 'lolcat');
    }
  };
  
  const showCowsay = (text) => {
    addMessage(
      <AsciiGenerator type="cow" text={text} rainbow={lolcatMode} />,
      lolcatMode ? 'lolcat' : 'system'
    );
  };
  
  const showFortune = () => {
    const fortunes = [
      "You will find a hidden treasure where you least expect it.",
      "A journey of a thousand miles begins with a single step.",
      "Your code will compile without errors on the first try.",
      "The bug you've been hunting is in the code you thought was perfect.",
      "A clean desk is a sign of a cluttered hard drive.",
      "You will soon receive an unexpected pull request.",
      "404: Fortune not found. Abort, retry, fail?",
      "There is a light at the end of the tunnel. It may be an oncoming train.",
      "The answer to your problem is in the man pages.",
      "You will be hungry again in one hour.",
      "It's not a bug, it's an undocumented feature.",
      "You will become a great developer, but only after many Git conflicts.",
      "Help! I'm trapped in a fortune cookie factory!",
      "The terminal is mightier than the GUI.",
      "Your linter will find embarrassing mistakes in your code."
    ];
    
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    addMessage(
      <AsciiGenerator type="ghost" text={randomFortune} rainbow={lolcatMode} />,
      lolcatMode ? 'lolcat' : 'system'
    );
  };
  
  const showMatrix = () => {
    addMessage('Entering the Matrix...', 'system');
    
    // Play matrix sound
    const audio = new Audio('/sounds/matrix.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play prevented:', e));
    
    // Create matrix effect
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';
    document.body.appendChild(matrixContainer);
    
    // Matrix animation timeout
    setTimeout(() => {
      document.body.removeChild(matrixContainer);
      addMessage('Exited the Matrix.', 'system');
    }, 10000);
  };
  
  return (
    <TerminalContext.Provider value={{ 
      messages, 
      addMessage, 
      commandHistory,
      currentCommandIndex,
      setCurrentCommandIndex,
      processCommand,
      lolcatMode
    }}>
      {children}
    </TerminalContext.Provider>
  );
};