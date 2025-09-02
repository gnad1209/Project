const Role = require('./role.model');

const roleService = {
  getAll: async () => await Role.findAll(),
  create: async (data) => await Role.create(data),
  delete: async (id) => await Role.remove(id),
};

module.exports = roleService;
