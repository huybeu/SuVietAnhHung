/**
 * AppError - Custom Error Class
 *
 * Lớp lỗi tùy chỉnh dùng xuyên suốt ứng dụng.
 * Phân biệt lỗi nghiệp vụ (operational) và lỗi hệ thống (programming).
 * Các operational error sẽ được trả về cho client với message rõ ràng.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
