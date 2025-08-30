const pool = require('../../config/db.mysql');

const Profile = {
  async create(userId, username, fullName, age, address, dateOfBirth) {
    const [result] = await pool.query(
      `INSERT INTO user_profiles (user_id, username, full_name, age, address, date_of_birth)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, username, fullName, age, address, dateOfBirth],
    );
    return result.insertId;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return rows[0];
  },
};

module.exports = Profile;
