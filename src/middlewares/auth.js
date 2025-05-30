const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

// Custom error class for authentication errors
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthError('Invalid token format');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    // Set user on request object
    req.user = user;
    next();
  } catch (error) {
    // Pass JWT errors to the error handler
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(error);
    }
    
    // Pass custom auth errors
    if (error instanceof AuthError) {
      return next(error);
    }
    
    // Log unexpected errors
    logger.error('Authentication error:', error);
    return next(new AuthError('Authentication failed'));
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthError('User not authenticated'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new Error('Access denied: Insufficient permissions'));
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  AuthError
}; 