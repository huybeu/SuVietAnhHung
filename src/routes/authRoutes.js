const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { authLimiter, registerLimiter, refreshLimiter } = require('../middlewares/rateLimiter');

// Public routes
router.post('/register', registerLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', refreshLimiter, authController.refresh);

// Protected routes (yêu cầu đăng nhập)
router.use(authenticate);
router.get('/me', authController.me);
router.patch('/me', authController.updateProfile);
router.patch('/change-password', authController.changePassword);
router.post('/logout-all', authController.logoutAll);

module.exports = router;
