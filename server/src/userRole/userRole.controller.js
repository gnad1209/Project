const userRoleService = require('./userRole.service');

const userRoleController = {
  assign: async (req, res) => {
    await userRoleService.assign(req.body);
    res.json({ message: 'Role assigned' });
  },
  revoke: async (req, res) => {
    await userRoleService.revoke(req.body);
    res.json({ message: 'Role revoked' });
  },
};

module.exports = userRoleController;
