const bcrypt = require('bcryptjs');
const User = require('./user.model');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

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

  update: async (id, updates, userId, files) => {
    const fields = [];
    const values = [];
    let imageUrls = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => uploadImage(file.buffer, file.originalname)),
      );

      // Ví dụ: lưu vào cột "images" (JSON)
      fields.push(`image = ?`);
      values.push(JSON.stringify(imageUrls));
    }

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

/**
 * Upload ảnh lên Cloudinary
 * @param {Buffer} fileBuffer - file buffer
 * @param {string} fileName - tên file gốc
 */
async function uploadImage(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: 'myapp/uploads', public_id: fileName.split('.')[0] },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url); // trả về URL ảnh
        },
      )
      .end(fileBuffer);
  });
}

module.exports = userService;
