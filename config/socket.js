function initSocket(io) {
  io.on('connection', (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on('chat message', (msg) => {
      console.log("📩 Message:", msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket };