/**
 * User Controller
 *
 * Nhận HTTP request, gọi Service tương ứng, và trả response về client.
 * Controller không chứa business logic — chỉ điều phối luồng request/response.
 * Mọi lỗi đều được chuyển sang errorHandler middleware thông qua next(error).
 */

const userService = require('../services/userService');
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userService.getAllUsers({ page, limit });
    return sendSuccess(res, result.users, 'Lấy danh sách người dùng thành công', 200, result.meta);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user, 'Lấy thông tin người dùng thành công');
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return sendCreated(res, user, 'Tạo người dùng thành công');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, user, 'Cập nhật người dùng thành công');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendSuccess(res, null, 'Xóa người dùng thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
