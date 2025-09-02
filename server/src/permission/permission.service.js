const Permission = require('./permission.model');

const permissionService = {
  getAll: async () => await Permission.findAll(),
  create: async (d) => await Permission.create(d),
  delete: async (id) => await Permission.remove(id),
};

module.exports = permissionService;
