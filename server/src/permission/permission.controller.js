const permissionService = require('./permission.service');

const permissionController = {
  getAll: async (req, res) => res.json(await permissionService.getAll()),
  create: async (req, res) => res.json({ id: await permissionService.create(req.body) }),
  delete: async (req, res) => {
    await permissionService.delete(req.params.id);
    res.json({ message: 'Deleted' });
  },
};

module.exports = permissionController;
