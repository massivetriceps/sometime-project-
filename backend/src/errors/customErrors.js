// P — 파라미터 누락/잘못된 값
class NoParams extends Error {
  errorCode = 'P001';
  statusCode = 400;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// U — 사용자 관련
class UserNotFoundError extends Error {
  errorCode = 'U001';
  statusCode = 404;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class DuplicateUserError extends Error {
  errorCode = 'U002';
  statusCode = 409;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidCredentialsError extends Error {
  errorCode = 'U003';
  statusCode = 401;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// T — 토큰 관련
class NoBearerToken extends Error {
  errorCode = 'T001';
  statusCode = 401;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidTokenError extends Error {
  errorCode = 'T002';
  statusCode = 401;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class AdminRequiredError extends Error {
  errorCode = 'T003';
  statusCode = 403;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// C — 강의/장바구니 관련
class CourseNotFoundError extends Error {
  errorCode = 'C001';
  statusCode = 404;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class DuplicateCartError extends Error {
  errorCode = 'C002';
  statusCode = 409;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class CartNotFoundError extends Error {
  errorCode = 'C003';
  statusCode = 404;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// S — 서버/내부 오류
class ServerError extends Error {
  errorCode = 'S001';
  statusCode = 500;
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

module.exports = {
  NoParams,
  UserNotFoundError,
  DuplicateUserError,
  InvalidCredentialsError,
  NoBearerToken,
  InvalidTokenError,
  AdminRequiredError,
  CourseNotFoundError,
  DuplicateCartError,
  CartNotFoundError,
  ServerError,
};
