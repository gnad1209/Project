const express = require('express');
const { cacheMiddleware } = require('./src/middlewares');
const router = express.Router();

// const userRoutes = require('./routes/user.routes');
const authRoutes = require('./src/auth/auth.route');

// router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.get('/users', cacheMiddleware, (req, res) => {
  res.json({ message: 'Get all users' });
});

router.post('/users', (req, res) => {
  res.json({ message: 'Create a user' });
});

module.exports = router;
