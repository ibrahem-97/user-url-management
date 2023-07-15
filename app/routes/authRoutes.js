const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/authUtils');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/reset-password', authController.resetPassword);

module.exports = router;