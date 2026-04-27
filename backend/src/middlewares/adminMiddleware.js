const jwt = require('jsonwebtoken');
const { NoBearerToken, InvalidTokenError, AdminRequiredError } = require('../errors/customErrors');

const JWT_SECRET = process.env.JWT_SECRET;

const isAdmin = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return next(new NoBearerToken('관리자 인증이 필요합니다.'));

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (!decoded.admin_id)
      return next(new AdminRequiredError('관리자 권한이 없습니다.'));

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.errorCode) return next(error);
    next(new InvalidTokenError('유효하지 않은 토큰입니다.'));
  }
};

module.exports = isAdmin;
