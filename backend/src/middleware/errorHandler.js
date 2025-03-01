const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Application error:', err);
  
  // Get status code
  const statusCode = err.statusCode || 500;
  
  // Send response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;