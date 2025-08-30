const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username }, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpire,
  });

  const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpire,
  });

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
