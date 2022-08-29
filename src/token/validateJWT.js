const jwtService = require('./tokenGenerate');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  const validToken = jwtService.validateToken(token);
  if (validToken.message) {
    const { code, message } = validToken;
     return res.status(code).json({ message });
    }

  next();
};