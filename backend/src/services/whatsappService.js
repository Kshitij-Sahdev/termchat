const axios = require('axios');
const qrcode = require('qrcode');
const crypto = require('crypto');
const config = require('../config/environment');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    // In a real application, this would use the WhatsApp Business API
    this.apiEndpoint = 'https://graph.facebook.com/v16.0';
    this.apiKey = config.whatsapp.apiKey;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    
    // For demo purposes, we'll store connection data in memory
    // In production, this would be stored in a database
    this.connections = new Map();
  }
  
  async generateConnectionInfo(phoneNumber) {
    try {
      // Generate a random token for this connection
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // QR code expires in 15 minutes
      
      // Generate QR code for demonstration purposes
      // In a real app, this would be from the WhatsApp API
      const qrCodeData = await qrcode.toDataURL(
        `whatsapp://connect?token=${token}&phone=${phoneNumber}`
      );
      
      // Store connection info
      this.connections.set(token, {
        phoneNumber,
        connected: false,
        expiresAt,
        lastSyncAt: null
      });
      
      // In a real application, this QR code would come from WhatsApp
      return { 
        token,
        qrCode: qrCodeData,
        expiresAt
      };
    } catch (error) {
      logger.error('Error generating WhatsApp connection info:', error);
      throw new Error('Failed to generate WhatsApp connection info');
    }
  }
  
  async checkConnectionStatus(token) {
    // For demo purposes
    if (!this.connections.has(token)) {
      return { connected: false };
    }
    
    const connection = this.connections.get(token);
    
    // Simulate connection establishment after a delay
    if (!connection.connected && connection.expiresAt > new Date()) {
      const timeElapsed = (new Date() - connection.expiresAt.getTime() + 15 * 60 * 1000) / 1000;
      
      // 60% chance of being connected after 5 minutes
      if (timeElapsed > 300 && Math.random() < 0.6) {
        connection.connected = true;
        connection.lastSyncAt = new Date();
        this.connections.set(token, connection);
      }
    }
    
    return {
      connected: connection.connected,
      lastSyncAt: connection.lastSyncAt
    };
  }
  
  async disconnect(token) {
    if (!this.connections.has(token)) {
      throw new Error('Connection not found');
    }
    
    this.connections.delete(token);
    return true;
  }
  
  async getContacts(token) {
    if (!this.connections.has(token) || !this.connections.get(token).connected) {
      throw new Error('WhatsApp is not connected');
    }
    
    // Mock contacts for demonstration
    return [
      { id: '1', name: 'Alice Smith', phoneNumber: '+1234567890', profilePicture: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Bob Johnson', phoneNumber: '+1987654321', profilePicture: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Charlie Williams', phoneNumber: '+1122334455', profilePicture: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Diana Brown', phoneNumber: '+5566778899', profilePicture: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Edward Davis', phoneNumber: '+9988776655', profilePicture: 'https://i.pravatar.cc/150?img=5' },
    ];
  }
  
  async sendMessage(token, to, message) {
    if (!this.connections.has(token) || !this.connections.get(token).connected) {
      throw new Error('WhatsApp is not connected');
    }
    
    // In a real app, this would use the WhatsApp Business API
    // Mock successful message sending
    return {
      id: crypto.randomBytes(16).toString('hex'),
      timestamp: new Date(),
      status: 'sent'
    };
  }
}

module.exports = WhatsAppService;