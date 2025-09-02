const express = require('express');
const { cacheMiddleware } = require('./server/src/middlewares');
const router = express.Router();

// const userRoutes = require('./routes/user.routes');
const authRoutes = require('./server/src/auth/auth.routes');
const userRoutes = require('./server/src/user/user.routes');
const groupRoutes = require('./server/src/group/group.routes');
const roleRoutes = require('./server/src/role/role.routes');
const permissionRoutes = require('./server/src/permission/permission.routes');
const userRoleRoutes = require('./server/src/userRole/userRole.routes');
const rolePermissionRoutes = require('./server/src/rolePermission/rolePermission.routes');
const { authenticateUser } = require('./server/src/middlewares/auth.middleware');
// router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/users', authenticateUser, userRoutes);
router.use('/groups', groupRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/user-roles', userRoleRoutes);
router.use('/role-permissions', rolePermissionRoutes);

module.exports = router;
