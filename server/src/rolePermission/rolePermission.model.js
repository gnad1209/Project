const RolePermission = {
  add: async ({ role_id, permission_id }) => {
    await db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [
      role_id,
      permission_id,
    ]);
  },
  remove: async ({ role_id, permission_id }) => {
    await db.query('DELETE FROM role_permissions WHERE role_id=? AND permission_id=?', [
      role_id,
      permission_id,
    ]);
  },
};

module.exports = RolePermission;
