const express = require('express');
const authController = require('./auth.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateUser, authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;
