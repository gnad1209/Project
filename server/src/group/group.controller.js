const groupService = require('./group.service');

const groupController = {
  getAll: async (req, res) => res.json(await groupService.getAll()),
  create: async (req, res) => res.json({ id: await groupService.create(req.body) }),
  delete: async (req, res) => {
    await groupService.delete(req.params.id);
    res.json({ message: 'Deleted' });
  },
};

module.exports = groupController;
