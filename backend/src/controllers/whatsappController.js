const User = require('../models/User');
const WhatsAppService = require('../services/whatsappService');
const logger = require('../utils/logger');
const { handleAsync } = require('../utils/responses');

// Initialize WhatsApp service
const whatsappService = new WhatsAppService();

// Connect to WhatsApp
exports.connect = handleAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  
  // Generate QR code for WhatsApp Web connection
  // Note: In a real app, this would integrate with WhatsApp Business API
  const connectionInfo = await whatsappService.generateConnectionInfo(phoneNumber);
  
  // Update user's WhatsApp connection info
  const user = await User.findById(req.user.id);
  user.whatsapp = {
    connected: false, // Will be updated to true after QR code is scanned
    phoneNumber,
    authToken: connectionInfo.token
  };
  await user.save();
  
  logger.info(`WhatsApp connection initiated for user: ${user.username}`);
  
  return res.status(200).json({
    message: 'WhatsApp connection initiated',
    qrCode: connectionInfo.qrCode,
    expiresAt: connectionInfo.expiresAt
  });
});

// Check WhatsApp connection status
exports.getStatus = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.whatsapp || !user.whatsapp.phoneNumber) {
    return res.status(200).json({
      connected: false,
      message: 'WhatsApp not connected'
    });
  }
  
  // Check connection status with service
  const status = await whatsappService.checkConnectionStatus(user.whatsapp.authToken);
  
  // Update user connection status if needed
  if (user.whatsapp.connected !== status.connected) {
    user.whatsapp.connected = status.connected;
    await user.save();
  }
  
  return res.status(200).json({
    connected: status.connected,
    phoneNumber: user.whatsapp.phoneNumber,
    lastSyncAt: status.lastSyncAt
  });
});

// Disconnect WhatsApp
exports.disconnect = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.whatsapp || !user.whatsapp.connected) {
    return res.status(400).json({ message: 'WhatsApp is not connected' });
  }
  
  // Disconnect from service
  await whatsappService.disconnect(user.whatsapp.authToken);
  
  // Update user info
  user.whatsapp = {
    connected: false,
    phoneNumber: null,
    authToken: null
  };
  await user.save();
  
  logger.info(`WhatsApp disconnected for user: ${user.username}`);
  
  return res.status(200).json({
    message: 'WhatsApp disconnected successfully'
  });
});

// Get WhatsApp contacts
exports.getContacts = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.whatsapp || !user.whatsapp.connected) {
    return res.status(400).json({ message: 'WhatsApp is not connected' });
  }
  
  const contacts = await whatsappService.getContacts(user.whatsapp.authToken);
  
  return res.status(200).json({ contacts });
});

// Send WhatsApp message
exports.sendMessage = handleAsync(async (req, res) => {
  const { to, message } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({ message: 'Recipient and message are required' });
  }
  
  const user = await User.findById(req.user.id);
  
  if (!user.whatsapp || !user.whatsapp.connected) {
    return res.status(400).json({ message: 'WhatsApp is not connected' });
  }
  
  const result = await whatsappService.sendMessage(
    user.whatsapp.authToken,
    to,
    message
  );
  
  logger.info(`WhatsApp message sent by ${user.username} to ${to}`);
  
  return res.status(200).json({
    message: 'Message sent successfully',
    messageId: result.id,
    sentAt: result.timestamp
  });
});