const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validator');

const router = express.Router();

// Registration validation
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .trim()
];

// Login validation
const loginValidation = [
  body('username')
    .isString()
    .withMessage('Username is required')
    .trim(),
  body('password')
    .isString()
    .withMessage('Password is required')
];

// Register a new user
router.post('/register', validate(registerValidation), authController.register);

// User login
router.post('/login', validate(loginValidation), authController.login);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 