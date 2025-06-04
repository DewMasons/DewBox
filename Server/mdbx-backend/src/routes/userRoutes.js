const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');

const router = express.Router();

// Get validated user info for Home.jsx
router.get('/me', verifyToken, (req, res, next) => {
  console.log('[ROUTE] GET /users/me accessed by user:', req.user.id);
  next();
}, UserController.getMe);

// Get subscriber info for Profile.jsx (requires token)
router.get('/subscriber', verifyToken, (req, res, next) => {
  console.log('[ROUTE] GET /users/subscriber accessed by user:', req.user.id);
  next();
}, UserController.getSubscriber);

// Update user profile (for Profile.jsx)
router.patch('/profile', verifyToken, (req, res, next) => {
  console.log('[ROUTE] PATCH /users/profile accessed by user:', req.user.id, 'Body:', req.body);
  next();
}, UserController.updateProfile);

module.exports = router;
