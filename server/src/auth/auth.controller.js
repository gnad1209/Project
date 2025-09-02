const authService = require('./auth.service');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authController = {
  register: async (req, res) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      const data = await authService.refresh(refreshToken);
      return res.json(data);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  },

  async logout(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ message: 'Token required' });
      }

      const token = authHeader.split(' ')[1]; // format: Bearer <token>
      if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
      }

      // verify token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await authService.logout(decoded.sub);

      return res.json({ message: 'Logged out successfully' });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  },
};

module.exports = authController;
