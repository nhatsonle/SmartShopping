const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { BadRequestError, UnauthorizedError } = require('../utils/errorUtils');
const { catchAsync } = require('../utils/errorUtils');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Register a new user
const register = catchAsync(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    where: { 
      [User.sequelize.Op.or]: [
        { username },
        { email }
      ]
    }
  });

  if (existingUser) {
    throw new BadRequestError('Username or email already in use');
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    passwordHash: password, // Will be hashed by model hook
    fullName,
    role: 'homemaker' // Default role
  });

  // Generate token
  const token = generateToken(user.userId, user.role);

  // Return user data (excluding sensitive information)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    }
  });
});

// User login
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ 
    where: { 
      [User.sequelize.Op.or]: [
        { username },
        { email: username } // Allow login with email as well
      ]
    }
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Validate password
  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user.userId, user.role);

  // Log successful login
  logger.info(`User ${user.username} logged in successfully`);

  // Return user data and token
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        familyGroupId: user.familyGroupId
      },
      token
    }
  });
});

// Refresh token
const refreshToken = catchAsync(async (req, res) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    // Generate new token
    const newToken = generateToken(user.userId, user.role);
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token: newToken }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired, please login again');
    }
    throw new UnauthorizedError('Invalid token');
  }
});

module.exports = {
  register,
  login,
  refreshToken
}; 