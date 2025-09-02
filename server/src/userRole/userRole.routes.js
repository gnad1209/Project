const router = require('express').Router();
const userRoleController = require('./userRole.controller');

router.post('/assign', userRoleController.assign);
router.post('/revoke', userRoleController.revoke);

module.exports = router;
