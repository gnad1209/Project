const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../config/jwt');

function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username }, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpire,
  });

  const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpire,
  });

  return { accessToken, refreshToken };
}

const clearCache = async (prefix, id = null) => {
  if (id) {
    await redis.del(`${prefix}:detail:${id}`);
  }
  // Xóa danh sách có thể bị ảnh hưởng
  const keys = await redis.keys(`${prefix}:list*`);
  if (keys.length) {
    await redis.del(keys);
  }
};

module.exports = { generateTokens, clearCache };
