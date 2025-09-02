const router = require('express').Router();
const roleController = require('./role.controller');

router.get('/', roleController.getAll);
router.post('/', roleController.create);
router.delete('/:id', roleController.delete);

module.exports = router;
