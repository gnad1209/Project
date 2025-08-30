// redisClient.js
const Redis = require('ioredis');

// Cấu hình Redis
const redis = new Redis({
  host: '127.0.0.1', // Địa chỉ máy chủ Redis
  port: 6379, // Cổng mặc định
  // Có thể thêm các tùy chọn khác nếu cần
});

// Kiểm tra kết nối
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redis;
