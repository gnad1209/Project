const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/auth.middleware');

// API cần đăng nhập
router.get('/profile', authenticateUser);

module.exports = router;
