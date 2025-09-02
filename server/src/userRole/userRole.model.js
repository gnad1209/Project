const db = require('../../../config/db.mysql');

const UserRole = {
  add: async ({ user_id, role_id }) => {
    await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [user_id, role_id]);
  },
  remove: async ({ user_id, role_id }) => {
    await db.query('DELETE FROM user_roles WHERE user_id=? AND role_id=?', [user_id, role_id]);
  },
};

module.exports = UserRole;
