const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/environment');
const logger = require('../utils/logger');

class InstagramService {
  constructor() {
    this.apiEndpoint = 'https://graph.instagram.com';
    this.clientId = config.instagram.clientId;
    this.clientSecret = config.instagram.clientSecret;
    this.redirectUri = config.instagram.redirectUri;
    
    // For demo purposes, store tokens in memory
    // In production, this would be stored in a database
    this.tokens = new Map();
  }
  
  generateAuthUrl() {
    const state = crypto.randomBytes(16).toString('hex');
    
    return `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=user_profile,user_media&response_type=code&state=${state}`;
  }
  
  async exchangeCodeForToken(code) {
    try {
      // In a real app, this would make a request to Instagram API
      // For demo purposes, we'll create a mock result
      const accessToken = crypto.randomBytes(32).toString('hex');
      const username = `user_${Math.floor(Math.random() * 10000)}`;
      const expiresIn = 5184000; // 60 days in seconds
      
      // Store token info
      this.tokens.set(accessToken, {
        username,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        valid: true
      });
      
      return {
        accessToken,
        username,
        userId: crypto.randomBytes(16).toString('hex'),
        profilePicture: `https://i.pravatar.cc/150?u=${username}`,
        expiresIn
      };
    } catch (error) {
      logger.error('Error exchanging Instagram code for token:', error);
      throw new Error('Failed to authenticate with Instagram');
    }
  }
  
  async verifyToken(token) {
    try {
      // In a real app, this would verify with Instagram API
      if (!this.tokens.has(token)) {
        return { valid: false };
      }
      
      const tokenInfo = this.tokens.get(token);
      
      return {
        valid: tokenInfo.valid && tokenInfo.expiresAt > new Date(),
        expiresAt: tokenInfo.expiresAt
      };
    } catch (error) {
      logger.error('Error verifying Instagram token:', error);
      return { valid: false };
    }
  }
  
  async revokeToken(token) {
    if (this.tokens.has(token)) {
      this.tokens.delete(token);
    }
    return true;
  }
  
  async getFollowers(token) {
    if (!this.tokens.has(token) || !this.tokens.get(token).valid) {
      throw new Error('Instagram is not connected or token is invalid');
    }
    
    // Mock followers for demonstration
    return [
      { id: '1', username: 'design_lover', fullName: 'Design Enthusiast', profilePicture: 'https://i.pravatar.cc/150?img=10' },
      { id: '2', username: 'travel_addict', fullName: 'World Traveler', profilePicture: 'https://i.pravatar.cc/150?img=11' },
      { id: '3', username: 'food_guru', fullName: 'Foodie Expert', profilePicture: 'https://i.pravatar.cc/150?img=12' },
      { id: '4', username: 'tech_geek', fullName: 'Tech Enthusiast', profilePicture: 'https://i.pravatar.cc/150?img=13' },
      { id: '5', username: 'fitness_freak', fullName: 'Fitness Coach', profilePicture: 'https://i.pravatar.cc/150?img=14' },
    ];
  }
  
  async sendDirectMessage(token, username, message) {
    if (!this.tokens.has(token) || !this.tokens.get(token).valid) {
      throw new Error('Instagram is not connected or token is invalid');
    }
    
    // Mock successful message sending
    return {
      threadId: crypto.randomBytes(16).toString('hex'),
      timestamp: new Date(),
      status: 'sent'
    };
  }
}

module.exports = InstagramService;