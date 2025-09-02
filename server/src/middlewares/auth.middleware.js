const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../config/jwt');
const dotenv = require('dotenv');
const userService = require('../user/user.service');
dotenv.config();

function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // format: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    const user = await userService.getById(decoded.sub);
    if (!user.is_login) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // Gán userId vào req.user.user
    req.user = { user: decoded.sub };
    next();
  });
}

module.exports = {
  authenticateUser,
};
