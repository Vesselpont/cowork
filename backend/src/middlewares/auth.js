const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError('Необходима авторизация', 401));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new AppError('Недействительный токен', 401));
    req.user = decoded;
    next();
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Недостаточно прав для выполнения операции', 403));
    }
    next();
  };
};