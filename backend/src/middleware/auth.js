const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/environment');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, access denied' });
    }
    
    // Add user to request
    req.user = { id: user._id, username: user.username };
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is invalid, access denied' });
  }
};

module.exports = auth;