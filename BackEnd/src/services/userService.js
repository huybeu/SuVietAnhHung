/**
 * User Service
 *
 * Chứa toàn bộ business logic liên quan đến User.
 * Tầng này không biết về HTTP request/response và không truy vấn database trực tiếp.
 * Giao tiếp với database thông qua UserRepository, throw AppError khi nghiệp vụ thất bại.
 */

import userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';

class UserService {
  async getAllUsers({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await userRepository.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      users: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) throw new AppError('Không tìm thấy người dùng', 404);

    return user;
  }

  async createUser(data) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new AppError('Email đã được sử dụng', 409);

    const user = await userRepository.create(data);

    const { password, ...result } = user.toJSON();
    return result;
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('Không tìm thấy người dùng', 404);

    if (data.email && data.email !== user.email) {
      const emailTaken = await userRepository.findByEmail(data.email);
      if (emailTaken) throw new AppError('Email đã được sử dụng', 409);
    }

    await userRepository.update(id, data);

    return userRepository.findById(id, { attributes: { exclude: ['password'] } });
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('Không tìm thấy người dùng', 404);

    await userRepository.delete(id);
  }
}

export default new UserService();
