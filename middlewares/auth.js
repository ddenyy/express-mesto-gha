const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  // достаём токен из кук
  const token = req.cookies.jwt;
  // убеждаемся, что токен в куках есть
  if (!token) {
    throw new UnauthorizedError('Нужна авторизация');
  }
  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch(err) {
    next(new UnauthorizedError('Нужна авторизация'));
  }
  req.user = payload;
  next();
}

module.exports = auth;

