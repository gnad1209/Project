require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const redis = require('./config/redis');
const app = require('./config/express');
const { initSocket } = require('./config/socket');
const cronJobs = require('./server/src/cron/index'); // auto load jobs

const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));
// HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: '*' },
});
initSocket(io);

// (async () => {
//   await sequelize.sync({ alter: true });  // ✅ Sequelize tự update DB
//   console.log('Database synced!');
// })();
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
