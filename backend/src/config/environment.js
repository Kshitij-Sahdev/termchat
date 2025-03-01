require('dotenv').config();

const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  version: '1.0.0',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/termchat',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'termchat-secret-key',
    expiresIn: '7d',
  },
  
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY,
    apiSecret: process.env.WHATSAPP_API_SECRET,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  },
  
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI,
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
};

module.exports = environment;