const pool = require('../../config/db.mysql');

const Token = {
  async saveRefreshToken(userId, token) {
    await db.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]); // clear cũ
    await db.query(
      'INSERT INTO user_tokens (user_id, refresh_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, token],
    );
  },

  async findByToken(token) {
    const [rows] = await db.query('SELECT * FROM user_tokens WHERE refresh_token = ?', [token]);
    return rows[0];
  },

  async deleteByUserId(userId) {
    await db.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]);
  },
};

module.exports = Token;
