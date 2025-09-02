const db = require('../../../config/db.mysql');

const Role = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM roles');
    return rows;
  },
  create: async ({ group_id, name, description }) => {
    const [res] = await db.query(
      'INSERT INTO roles (group_id, name, description) VALUES (?, ?, ?)',
      [group_id, name, description],
    );
    return res.insertId;
  },
  remove: async (id) => {
    await db.query('DELETE FROM roles WHERE id=?', [id]);
  },
};
module.exports = Role;
