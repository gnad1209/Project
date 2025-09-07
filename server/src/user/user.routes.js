const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { cacheMiddleware } = require('../middlewares');
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB
  fileFilter: (req, files, cb) => {
    const ext = path.extname(files.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

// API cần đăng nhập
router.get('/profile', userController.getProfile);
router.put('/update-by-user', upload.array('files', 10), userController.updateByUser);

router
  .route('/')
  .get(cacheMiddleware, userController.getAll)
  .post(userController.create)
  .delete(userController.delete);
router
  .route('/:id')
  .get(userController.getById)
  .put(upload.array('files', 10), userController.update);

module.exports = router;
