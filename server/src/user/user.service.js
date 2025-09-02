const bcrypt = require('bcryptjs');
const User = require('./user.model');

const userService = {
  getAll: async (query) => {
    return await User.findAll(query);
  },

  getById: async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  create: async (data) => {
    const existsEmail = await User.findByEmail(data.email);
    if (existsEmail) throw new Error('Email already exists');

    const existsUsername = await User.findByUsername(data.username);
    if (existsUsername) throw new Error('username already exists');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = await User.create({ passwordHash, ...data });
    return result;
  },

  update: async (id, updates, userId) => {
    const fields = [];
    const values = [];

    // Lặp qua các trường trong đối tượng updates
    for (const key of Object.keys(updates)) {
      if (updates[key] !== undefined) {
        if (key === 'id') {
          const existsRecord = await User.findById(updates.id);
          if (!existsRecord) throw new Error('Id not exists');
        }
        if (key === 'email') {
          const existsEmail = await User.findByEmail(updates.email, userId);
          if (existsEmail) throw new Error('Email already exists');
        }
        if (key === 'username') {
          const existsUsername = await User.findByUsername(updates.username, userId);
          if (existsUsername) throw new Error('username already exists');
        }

        // Kiểm tra trường không phải là undefined
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    // Nếu không có trường nào để cập nhật
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Tạo câu lệnh SQL
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND status = "ACTIVE"`;
    values.push(id); // Thêm id vào danh sách giá trị
    return await User.update(sql, values);
  },

  delete: async (id) => {
    return await User.remove(id);
  },
};

module.exports = userService;
