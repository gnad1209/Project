const roleService = require('./role.service');

const roleController = {
  getAll: async (req, res) => res.json(await roleService.getAll()),
  create: async (req, res) => res.json({ id: await roleService.create(req.body) }),
  delete: async (req, res) => {
    await roleService.delete(req.params.id);
    res.json({ message: 'Deleted' });
  },
};

module.exports = roleController;
