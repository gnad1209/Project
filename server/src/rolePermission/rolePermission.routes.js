const router = require('express').Router();
const rolePermissionController = require('./rolePermission.controller');

router.post('/assign', rolePermissionController.assign);
router.post('/revoke', rolePermissionController.revoke);

module.exports = router;
