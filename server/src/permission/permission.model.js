const db = require('../../../config/db.mysql');

const Permission = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM permissions');
    return rows;
  },
  create: async ({ name, code }) => {
    const [res] = await db.query('INSERT INTO permissions (name, code) VALUES (?, ?)', [
      name,
      code,
    ]);
    return res.insertId;
  },
  remove: async (id) => {
    await db.query('DELETE FROM permissions WHERE id=?', [id]);
  },
};

module.exports = Permission;
