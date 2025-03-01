const User = require('../models/User');
const InstagramService = require('../services/instagramService');
const logger = require('../utils/logger');
const { handleAsync } = require('../utils/responses');

// Initialize Instagram service
const instagramService = new InstagramService();

// Get Instagram auth URL
exports.getAuthUrl = handleAsync(async (req, res) => {
  const authUrl = instagramService.generateAuthUrl();
  
  return res.status(200).json({ authUrl });
});

// Connect to Instagram with auth code
exports.connect = handleAsync(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }
  
  // Exchange code for access token
  const authResult = await instagramService.exchangeCodeForToken(code);
  
  // Update user's Instagram connection info
  const user = await User.findById(req.user.id);
  user.instagram = {
    connected: true,
    username: authResult.username,
    authToken: authResult.accessToken
  };
  await user.save();
  
  logger.info(`Instagram connected for user: ${user.username}`);
  
  return res.status(200).json({
    message: 'Instagram connected successfully',
    username: authResult.username,
    profilePicture: authResult.profilePicture
  });
});

// Check Instagram connection status
exports.getStatus = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.instagram || !user.instagram.authToken) {
    return res.status(200).json({
      connected: false,
      message: 'Instagram not connected'
    });
  }
  
  // Verify token with Instagram API
  const status = await instagramService.verifyToken(user.instagram.authToken);
  
  // Update user connection status if needed
  if (user.instagram.connected !== status.valid) {
    user.instagram.connected = status.valid;
    await user.save();
  }
  
  return res.status(200).json({
    connected: status.valid,
    username: user.instagram.username,
    expiresAt: status.expiresAt
  });
});

// Disconnect Instagram
exports.disconnect = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.instagram || !user.instagram.connected) {
    return res.status(400).json({ message: 'Instagram is not connected' });
  }
  
  // Revoke token with Instagram API
  await instagramService.revokeToken(user.instagram.authToken);
  
  // Update user info
  user.instagram = {
    connected: false,
    username: null,
    authToken: null
  };
  await user.save();
  
  logger.info(`Instagram disconnected for user: ${user.username}`);
  
  return res.status(200).json({
    message: 'Instagram disconnected successfully'
  });
});

// Get Instagram followers
exports.getFollowers = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.instagram || !user.instagram.connected) {
    return res.status(400).json({ message: 'Instagram is not connected' });
  }
  
  const followers = await instagramService.getFollowers(user.instagram.authToken);
  
  return res.status(200).json({ followers });
});

// Send Instagram direct message
exports.sendDirectMessage = handleAsync(async (req, res) => {
  const { username, message } = req.body;
  
  if (!username || !message) {
    return res.status(400).json({ message: 'Username and message are required' });
  }
  
  const user = await User.findById(req.user.id);
  
  if (!user.instagram || !user.instagram.connected) {
    return res.status(400).json({ message: 'Instagram is not connected' });
  }
  
  const result = await instagramService.sendDirectMessage(
    user.instagram.authToken,
    username,
    message
  );
  
  logger.info(`Instagram DM sent by ${user.username} to ${username}`);
  
  return res.status(200).json({
    message: 'Direct message sent successfully',
    threadId: result.threadId,
    sentAt: result.timestamp
  });
});