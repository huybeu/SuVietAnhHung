/**
 * Error Handler Middleware
 *
 * Middleware tập trung xử lý toàn bộ lỗi xảy ra trong ứng dụng.
 * Phân loại lỗi: AppError (operational) trả message rõ ràng cho client,
 * lỗi Sequelize được map sang format chuẩn, lỗi hệ thống trả 500.
 * Phải đặt CUỐI CÙNG trong chuỗi middleware của Express (4 tham số).
 */

import AppError from '../utils/AppError.js';
import { sendError } from '../utils/response.js';

const handleSequelizeValidationError = (err) => {
  const messages = err.errors.map((e) => e.message).join(', ');
  return new AppError(messages, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0]?.path || 'field';
  return new AppError(`Giá trị của '${field}' đã tồn tại`, 409);
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleSequelizeUniqueConstraintError(err);
  } else if (!err.isOperational) {
    if (process.env.NODE_ENV === 'development') {
      console.error('UNEXPECTED ERROR:', err);
    }
    error = new AppError('Lỗi hệ thống, vui lòng thử lại sau', 500);
  }

  return sendError(res, error.message, error.statusCode, error.errors || null);
};

export default errorHandler;
