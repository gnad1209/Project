const db = require('../../../config/db.mysql');

const Group = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM user_groups');
    return rows;
  },
  create: async ({ name }) => {
    const [res] = await db.query('INSERT INTO user_groups (name) VALUES (?)', [name]);
    return res.insertId;
  },
  remove: async (id) => {
    await db.query('DELETE FROM user_groups WHERE id=?', [id]);
  },
};

module.exports = Group;
