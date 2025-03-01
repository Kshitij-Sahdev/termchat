const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/environment');
const logger = require('../utils/logger');
const { handleAsync } = require('../utils/responses');

// Register a new user
exports.register = handleAsync(async (req, res) => {
  const { username, password, email } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ 
      message: 'Username already exists'
    });
  }
  
  // Create new user
  const newUser = new User({
    username,
    password,
    email,
    lastLoginAt: new Date(),
  });
  
  await newUser.save();
  
  // Generate JWT token
  const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  
  logger.info(`User registered: ${username}`);
  
  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.email,
      settings: newUser.settings,
    },
    token,
  });
});

// Login user
exports.login = handleAsync(async (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Validate password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save();
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  
  logger.info(`User logged in: ${username}`);
  
  return res.status(200).json({
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      settings: user.settings,
    },
    token,
  });
});

// Get current user
exports.getMe = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  return res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      settings: user.settings,
      whatsapp: {
        connected: user.whatsapp.connected
      },
      instagram: {
        connected: user.instagram.connected
      },
      lastLoginAt: user.lastLoginAt,
    }
  });
});

// Update user settings
exports.updateSettings = handleAsync(async (req, res) => {
  const { settings } = req.body;
  
  if (!settings) {
    return res.status(400).json({ message: 'Settings are required' });
  }
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update only valid settings fields
  if (settings.theme) user.settings.theme = settings.theme;
  if (settings.terminalFont) user.settings.terminalFont = settings.terminalFont;
  if (settings.fontSize) user.settings.fontSize = settings.fontSize;
  if (settings.showScanLines !== undefined) user.settings.showScanLines = settings.showScanLines;
  if (settings.terminalSounds !== undefined) user.settings.terminalSounds = settings.terminalSounds;
  
  await user.save();
  
  logger.info(`User settings updated: ${user.username}`);
  
  return res.status(200).json({
    message: 'Settings updated successfully',
    settings: user.settings
  });
});