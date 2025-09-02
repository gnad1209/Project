const router = require('express').Router();
const permissionController = require('./permission.controller');

router.get('/', permissionController.getAll);
router.post('/', permissionController.create);
router.delete('/:id', permissionController.delete);

module.exports = router;
