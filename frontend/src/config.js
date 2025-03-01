const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    appName: 'TermChat',
    version: '1.0.0',
    supportEmail: 'support@termchat.com',
    defaultTheme: 'theme-green',
    sounds: {
      enabled: true,
      volume: 0.3,
    },
    features: {
      whatsapp: true,
      instagram: true,
      nativeChat: true,
      lolcat: true,
    },
    terminalDefaults: {
      prompt: '$ ',
      fontSize: '16px',
      fontFamily: 'Fira Code, monospace',
    }
  };
  
  export default config;