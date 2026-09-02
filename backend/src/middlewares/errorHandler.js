const AppError = require('../utils/AppError');

// Класс ошибки (экспортируется отдельно)
class CustomAppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Сам middleware обработки ошибок
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  console.error(`[ERROR] ${err.status.toUpperCase()}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'fail', message: 'Неверный ID' });
  }
  if (err.code === 11000) {
    return res.status(400).json({ status: 'fail', message: 'Дублирование данных' });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ status: 'fail', message });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

module.exports = { AppError: CustomAppError, globalErrorHandler };