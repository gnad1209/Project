const rolePermissionService = require('./rolePermission.service');

const rolePermissionController = {
  assign: async (req, res) => {
    await rolePermissionService.assign(req.body);
    res.json({ message: 'Permission assigned' });
  },
  revoke: async (req, res) => {
    await rolePermissionService.revoke(req.body);
    res.json({ message: 'Permission revoked' });
  },
};

module.exports = rolePermissionController;
