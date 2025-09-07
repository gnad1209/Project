const db = require('../../../config/db.mysql');
const { buildSelectQuery } = require('../../heplers/common');

const User = {
  async create({ userId, email, username, fullName, age, address, dateOfBirth, passwordHash }) {
    const [result] = await db.query(
      `INSERT INTO users (user_id, email, username, full_name, age, address, date_of_birth, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, username, fullName, age, address, dateOfBirth, passwordHash],
    );
    return result.insertId;
  },

  async findByEmail(email, id) {
    const query = id
      ? 'SELECT * FROM users WHERE email = ? AND id != ? AND status = "ACTIVE"'
      : 'SELECT * FROM users WHERE email = ? AND status = "ACTIVE"';
    const values = id ? [email, id] : [email];

    const [rows] = await db.query(query, values);
    return rows[0];
  },

  async findByUsername(username, id) {
    const query = id
      ? 'SELECT * FROM users WHERE username = ? AND id != ? AND status = "ACTIVE"'
      : 'SELECT * FROM users WHERE username = ? AND status = "ACTIVE"';
    const values = id ? [username, id] : [username];

    const [rows] = await db.query(query, values);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT user_id, email, username, full_name, age, address, date_of_birth, is_login FROM users WHERE id = ? AND status = "ACTIVE"',
      [id],
    );
    return rows[0];
  },

  async findAll(query) {
    const { sql, params } = buildSelectQuery('users', {
      select: [
        'user_id',
        'email',
        'username',
        'full_name',
        'age',
        'address',
        'date_of_birth',
        'is_login',
      ],
      filters: {
        age: query.age,
        address: query.address,
      },
      search: {
        fields: ['username', 'email', 'full_name', 'username_en', 'email_en', 'full_name_en'],
        keyword: query.search,
      },
      status: query.status || 'ACTIVE',
      sort: [
        { field: 'updated_at', order: 'DESC' },
        { field: 'username', order: 'ASC' },
      ],
      page: query.page || 1,
      limit: query.limit || 10,
    });

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async logoutAccount(id) {
    const [rows] = await db.query('UPDATE users SET is_login = FALSE WHERE id = ?', [id]);
    return rows[0];
  },

  async update(sql, values) {
    await db.query(sql, values);
  },

  async remove(id) {
    await db.query('UPDATE users SET status = "DELETED" WHERE id IN (?)', [id]);
  },
};

module.exports = User;
