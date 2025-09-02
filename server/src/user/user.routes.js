const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { cacheMiddleware } = require('../middlewares');
// API cần đăng nhập
router.get('/profile', userController.getProfile);
router.put('/update-by-user', userController.updateByUser);

router
  .route('/')
  .get(cacheMiddleware, userController.getAll)
  .post(userController.create)
  .delete(userController.delete);
router.route('/:id').get(userController.getById).put(userController.update);

module.exports = router;
