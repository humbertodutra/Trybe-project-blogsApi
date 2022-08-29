const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const jwtConfig = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const createToken = (user) => {
    const token = jwt.sign({ data: user }, JWT_SECRET, jwtConfig);

    return token;
};

const validateToken = (token) => {
    try {
      const { data } = jwt.verify(token, JWT_SECRET);
  
      return data;
    } catch (_err) {
      return { code: 401, message: 'Expired or invalid token' };
    }
};

module.exports = {
  createToken,
  validateToken,
};