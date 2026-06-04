/**
 * User Repository
 *
 * Kế thừa BaseRepository và bổ sung các query đặc thù liên quan đến User.
 * Tầng này chỉ chịu trách nhiệm tương tác với database — không chứa business logic.
 * Mọi query phức tạp (join, subquery, raw SQL) đều nằm ở đây, không rải rác ở Service.
 */

const { Op } = require('sequelize');
const BaseRepository = require('./baseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findActiveUsers() {
    return this.model.findAll({ where: { is_active: true } });
  }

  async searchByName(keyword, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    return this.model.findAndCountAll({
      where: {
        name: { [Op.like]: `%${keyword}%` },
      },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }
}

module.exports = new UserRepository();
