const authService = require('./auth.service');

const userController = {
  register: async (req, res) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = authController;
