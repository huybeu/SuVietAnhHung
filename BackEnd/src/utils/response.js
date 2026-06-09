/**
 * Response Utility
 *
 * Chuẩn hóa toàn bộ response trả về cho client theo 1 format thống nhất.
 * Mọi API response đều đi qua đây để đảm bảo tính nhất quán.
 *
 * Format chuẩn:
 *   { success, message, data, meta (pagination) }
 */

const sendSuccess = (res, data = null, message = 'Thành công', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

const sendCreated = (res, data = null, message = 'Tạo mới thành công') => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

const sendNotFound = (res, message = 'Không tìm thấy dữ liệu') => {
  return sendError(res, message, 404);
};

const sendBadRequest = (res, message = 'Dữ liệu không hợp lệ', errors = null) => {
  return sendError(res, message, 400, errors);
};

const sendUnauthorized = (res, message = 'Chưa xác thực') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Không có quyền truy cập') => {
  return sendError(res, message, 403);
};

export {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
};
