const connection = require('../../../config/db.mysql');
const { authenticateUser } = require('../middlewares/auth.middleware');

async function handleSendMessages(io, socket) {
  socket.on('send message', async (msg) => {
    try {
      const query = 'INSERT INTO messages (user_id, content) VALUES (?, ?)';
      await connection.query(query, [2, msg]); // Sử dụng await với promise
      io.emit('chat message', msg); // Gửi tin nhắn đến tất cả client
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
}

async function handleGetMessages(socket) {
  socket.on('get messages', async () => {
    try {
      const [results] = await connection.query('SELECT * FROM messages'); // Sử dụng await với promise
      socket.emit('messages', results); // Gửi kết quả về client
    } catch (err) {
      console.error('Error fetching messages:', err);
      socket.emit('error', 'Error fetching messages');
    }
  });
}

async function authenticateUserSocket(socket) {
  socket.on('verify', async () => {
    try {
      if (socket.handshake) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, async (err, decoded) => {
          if (decoded) {
            socket.token = socket.handshake.query.token;
            socket.userId = decoded.sub;
            // Gán userId vào req.user.user
            return next();
          } else {
            socket.disconnect('unauthorized');
            return next(new Error('Xác thực thất bại'));
          }
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      socket.emit('error', 'Error fetching messages');
    }
  });
}

module.exports = {
  handleSendMessages,
  handleGetMessages,
  authenticateUserSocket,
};
