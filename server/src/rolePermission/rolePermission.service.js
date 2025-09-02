const RolePermission = require('./rolePermission.model');

const rolePermissionService = {
  assign: async (d) => await RolePermission.add(d),
  revoke: async (d) => await RolePermission.remove(d),
};

module.exports = rolePermissionService;
