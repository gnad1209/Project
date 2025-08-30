require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const redis = require('./config/redis');
const app = require('./config/express');
const { initSocket } = require('./config/socket');
const cronJobs = require('./src/cron/index'); // auto load jobs

const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));
// HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: '*' },
});
initSocket(io);

// Middleware để kiểm tra cache
const cacheMiddleware = async (req, res, next) => {
  const { key } = req.params; // Giả sử bạn muốn cache dựa trên một tham số

  const cacheResult = await redis.get(key);
  if (cacheResult) {
    return res.json(JSON.parse(cacheResult)); // Trả về dữ liệu từ cache
  }

  next();
};

// (async () => {
//   await sequelize.sync({ alter: true });  // ✅ Sequelize tự update DB
//   console.log('Database synced!');
// })();
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
