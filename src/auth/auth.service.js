const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const Profile = require('../user/user.model');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Nên để trong .env

const authService = {
  async register({ email, password, username, fullName, age, address, dateOfBirth }) {
    const existsEmail = await User.findByEmail(email);
    if (existsEmail) throw new Error('Email already exists');

    const existsUsername = await User.findByUsername(username);
    if (existsUsername) throw new Error('username already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await User.create(email, username, passwordHash);

    await Profile.create(userId, username, fullName, age, address, dateOfBirth);
    return { id: userId, email, username, fullName };
  },

  async login(username, password) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('Invalid credentials');
    const accessToken = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '15m',
    });

    // Tạo refresh token
    const refreshToken = jwt.sign({ sub: user.id, username: user.username }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES,
    });

    // Lưu refresh token vào DB
    await Token.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error('No refresh token provided');

    // Kiểm tra refreshToken có trong DB không
    const stored = await Token.findByToken(refreshToken);
    if (!stored) throw new Error('Invalid refresh token');

    try {
      // Verify refreshToken
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // Tạo access token mới
      const newAccessToken = jwt.sign(
        { sub: payload.sub, username: payload.username },
        JWT_SECRET,
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error('Refresh token expired or invalid');
    }
  },

  async logout(userId) {
    // Xóa refreshToken của user trong DB
    await Token.deleteByUserId(userId);
    return { message: 'Logged out successfully' };
  },
};

module.exports = authService;
