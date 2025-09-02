const { authenticateUser } = require('../server/src/middlewares/auth.middleware');
const {
  handleGetMessages,
  handleSendMessages,
  authenticateUserSocket,
} = require('../server/src/socket');
const dbConfig = require('./db.mysql');

async function updateUserStatus(socketId, status) {
  try {
    const [result] = await dbConfig.query('UPDATE users SET is_login = ? WHERE socketId = ?', [
      status,
      socketId,
    ]);
    console.log(`User status updated to ${status}.`);
  } catch (error) {
    console.error('Error updating user status:', error);
  } finally {
    await connection.end();
  }
}

function initSocket(io) {
  io.on('connection', async (socket) => {
    console.log('🔌 New client connected:', socket.id);
    await authenticateUserSocket(socket);
    // Đăng ký các hàm xử lý sự kiện
    handleGetMessages(socket);
    handleSendMessages(io, socket); // Truyền io vào
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      if (socket.userId) {
        await updateUserStatus(socket.userId, false); // Cập nhật trạng thái người dùng
      }
    });
  });
}

module.exports = { initSocket };
