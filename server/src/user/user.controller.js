const userService = require('./user.service');

const userController = {
  getAll: async (req, res) => {
    try {
      const users = await userService.getAll(req.query);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const user = await userService.getById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = req.user;
      const user = await userService.getById(userId);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const id = await userService.create(req.body);
      if (!id) {
        res.status(400).json({ error: 'Tạo tài khoản thất bại' });
      }
      res.status(201).json({ id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      await userService.update(req.params.id, req.body, req.user.user);
      res.json({ message: 'Updated successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateByUser: async (req, res) => {
    try {
      const { id } = req.body;
      await userService.update(id, req.body);
      res.json({ message: 'Updated successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { ids } = req.body;
      const placeholders = ids.join(', ');
      await userService.delete(placeholders);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = userController;
