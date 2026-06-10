const { Hero, Era, Article, Tag, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

const FEATURED_LIMIT = 5;

const heroController = {
  async list(req, res, next) {
    try {
      const {
        page = 1, limit = 20, q, era_id, is_featured, is_active,
        sortBy = 'sort_order', sortDir = 'ASC', select,
      } = req.query;

      const where = {};
      if (q) where.name = { [Op.like]: `%${q}%` };
      if (era_id) where.era_id = era_id;
      if (is_featured !== undefined) where.is_featured = is_featured === 'true';
      if (is_active !== undefined) where.is_active = is_active === 'true';
      else where.is_active = true;

      const offset = (Number(page) - 1) * Number(limit);
      const allowedSort = ['sort_order', 'name', 'birth_year', 'createdAt'];
      const order = [[allowedSort.includes(sortBy) ? sortBy : 'sort_order', sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];

      let attributes = undefined;
      if (select) attributes = select.split(',').map(s => s.trim());

      const { count, rows } = await Hero.findAndCountAll({
        where, offset, limit: Number(limit), order, attributes,
        include: [{ model: Era, as: 'era', attributes: ['id', 'name', 'period'] }],
      });

      sendSuccess(res, rows, 'Thành công', 200, { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const hero = await Hero.findByPk(req.params.id, {
        include: [{ model: Era, as: 'era', attributes: ['id', 'name', 'period'] }],
      });
      if (!hero) return sendNotFound(res, 'Không tìm thấy anh hùng');
      sendSuccess(res, hero);
    } catch (err) { next(err); }
  },

  async getBySlug(req, res, next) {
    try {
      const hero = await Hero.findOne({
        where: { slug: req.params.slug },
        include: [{ model: Era, as: 'era', attributes: ['id', 'name', 'period'] }],
      });
      if (!hero) return sendNotFound(res, 'Không tìm thấy anh hùng');
      sendSuccess(res, hero);
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const hero = await Hero.create({ ...req.body, created_by: req.user?.id });
      sendCreated(res, hero, 'Tạo anh hùng thành công');
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const hero = await Hero.findByPk(req.params.id);
      if (!hero) return sendNotFound(res, 'Không tìm thấy anh hùng');
      await hero.update({ ...req.body, updated_by: req.user?.id });
      sendSuccess(res, hero, 'Cập nhật thành công');
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      const hero = await Hero.findByPk(req.params.id);
      if (!hero) return sendNotFound(res, 'Không tìm thấy anh hùng');
      await hero.destroy();
      sendSuccess(res, null, 'Xoá thành công');
    } catch (err) { next(err); }
  },

  async toggleFeatured(req, res, next) {
    try {
      const hero = await Hero.findByPk(req.params.id);
      if (!hero) return sendNotFound(res, 'Không tìm thấy anh hùng');

      const newVal = !hero.is_featured;
      if (newVal) {
        const count = await Hero.count({ where: { is_featured: true, id: { [Op.ne]: hero.id } } });
        if (count >= FEATURED_LIMIT) {
          return sendBadRequest(res, `Chỉ được phép tối đa ${FEATURED_LIMIT} anh hùng nổi bật`);
        }
      }
      await hero.update({ is_featured: newVal, updated_by: req.user?.id });
      sendSuccess(res, hero, newVal ? 'Đã đánh dấu nổi bật' : 'Đã bỏ đánh dấu nổi bật');
    } catch (err) { next(err); }
  },

  async reorder(req, res, next) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return sendBadRequest(res, 'ids phải là mảng');
      await Promise.all(ids.map((id, idx) => Hero.update({ sort_order: idx }, { where: { id } })));
      sendSuccess(res, null, 'Cập nhật thứ tự thành công');
    } catch (err) { next(err); }
  },
};

module.exports = heroController;
