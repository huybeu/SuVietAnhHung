/**
 * Base Repository
 *
 * Lớp repository cơ sở chứa các thao tác CRUD chung cho mọi model Sequelize.
 * Các repository cụ thể (UserRepository, v.v.) kế thừa lớp này và mở rộng
 * thêm các query đặc thù của từng entity.
 *
 * Tách biệt hoàn toàn logic truy vấn database khỏi tầng Service.
 */

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(where, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const [affectedRows] = await this.model.update(data, {
      where: { id },
      ...options,
    });
    return affectedRows;
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

export default BaseRepository;
