const jwt = require('jsonwebtoken');
const { NoBearerToken, InvalidTokenError } = require('../errors/customErrors');

const JWT_SECRET = process.env.JWT_SECRET || 'gachon-time-table-super-secret-key';

const isLoggedIn = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return next(new NoBearerToken('인증 토큰이 없습니다.'));

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.errorCode) return next(error);
    next(new InvalidTokenError('유효하지 않거나 만료된 토큰입니다.'));
  }
};

module.exports = isLoggedIn;
