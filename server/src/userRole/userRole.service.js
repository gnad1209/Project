const UserRole = require('./userRole.model');

const userRoleService = {
  assign: async (data) => await UserRole.add(data),
  revoke: async (data) => await UserRole.remove(data),
};

module.exports = userRoleService;
