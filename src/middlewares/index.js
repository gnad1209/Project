const redis = require('../../config/redis'); // Import redis client

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl; // Sử dụng URL làm key cho cache

  const cacheResult = await redis.get(key);
  if (cacheResult) {
    return res.json(JSON.parse(cacheResult)); // Trả về dữ liệu từ cache
  }

  // Nếu không có trong cache, lưu dữ liệu sau khi gọi tiếp theo
  res.sendResponse = res.send;
  res.send = async (body) => {
    // Lưu vào cache với thời gian hết hạn (ví dụ 60 giây)
    await redis.setex(key, 60, body);
    res.sendResponse(body);
  };

  next();
};

module.exports = {
  cacheMiddleware,
};
