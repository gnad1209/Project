require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');

const app = require('./config/express');
const { initSocket } = require('./config/socket');
const cronJobs = require('./src/cron'); // auto load jobs

const PORT = process.env.PORT || 3000;

// HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});
initSocket(io);

app.use(morgan('dev'));

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});