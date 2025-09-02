const router = require('express').Router();
const groupController = require('./group.controller');

router.get('/', groupController.getAll);
router.post('/', groupController.create);
router.delete('/:id', groupController.delete);

module.exports = router;
