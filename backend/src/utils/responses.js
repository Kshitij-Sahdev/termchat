const logger = require('./logger');

/**
 * Wrapper for async controller functions to handle errors
 * 
 * @param {Function} fn - The async controller function
 * @returns {Function} - The wrapped function with error handling
 */
exports.handleAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error(`Error in ${fn.name || 'async handler'}: ${error.message}`);
      next(error);
    }
  };
};

/**
 * Send a success response
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object|Array|null} data - Data to send in response
 */
exports.sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object|null} errors - Additional error details
 */
exports.sendError = (res, statusCode = 500, message = 'Error', errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};