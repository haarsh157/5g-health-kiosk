const express = require('express');
const router = express.Router();
const { signup, login, verifyToken,logoutUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',authMiddleware,logoutUser);

// Protected route (requires valid token)
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;