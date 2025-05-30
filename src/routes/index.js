const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const familyGroupRoutes = require('./familyGroup');
const foodCategoryRoutes = require('./foodCategory');
const unitRoutes = require('./unit');
const foodItemMasterRoutes = require('./foodItemMaster');
const shoppingListRoutes = require('./shoppingList');
const pantryItemRoutes = require('./pantryItem');
const recipeRoutes = require('./recipe');
const mealPlanRoutes = require('./mealPlan');
const notificationRoutes = require('./notification');
const adminRoutes = require('./admin');

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/family-groups', familyGroupRoutes);
router.use('/food-categories', foodCategoryRoutes);
router.use('/units', unitRoutes);
router.use('/food-items', foodItemMasterRoutes);
router.use('/shopping-lists', shoppingListRoutes);
router.use('/pantry-items', pantryItemRoutes);
router.use('/recipes', recipeRoutes);
router.use('/meal-plans', mealPlanRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// API Root
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Shopping & Pantry Management System API',
    version: '1.0.0'
  });
});

module.exports = router; 