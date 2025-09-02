const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const Token = require('./auth.model');
const dotenv = require('dotenv');
dotenv.config();

const authService = {
  async register(data) {
    const existsEmail = await User.findByEmail(data.email);
    if (existsEmail) throw new Error('Email already exists');

    const existsUsername = await User.findByUsername(data.username);
    if (existsUsername) throw new Error('username already exists');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = await User.create({ passwordHash, ...data });

    return { id: userId, ...data };
  },

  async login(username, password) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('Invalid credentials');
    const accessToken = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    // Tạo refresh token
    const refreshToken = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRES,
      },
    );

    const query = `UPDATE users SET is_login = true WHERE id = ${user.id} AND status = "ACTIVE"`;
    // Lưu refresh token vào DB
    await Promise.all([Token.saveRefreshToken(user.id, refreshToken), User.update(query)]);

    return { accessToken, refreshToken, userId: user.id };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error('No refresh token provided');

    // Kiểm tra refreshToken có trong DB không
    const stored = await Token.findByToken(refreshToken);
    if (!stored) throw new Error('Invalid refresh token');

    try {
      // Verify refreshToken
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Tạo access token mới
      const newAccessToken = jwt.sign(
        { sub: payload.sub, username: payload.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error('Refresh token expired or invalid');
    }
  },

  async logout(userId) {
    // Xóa refreshToken của user trong DB
    await Promise.all([Token.deleteByUserId(userId), User.logoutAccount(userId)]);
    return { message: 'Logged out successfully' };
  },
};

module.exports = authService;
