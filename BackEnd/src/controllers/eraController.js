const { Era, Hero } = require('../models');
const { sendSuccess, sendNotFound } = require('../utils/response');

const eraController = {
  async list(req, res, next) {
    try {
      const eras = await Era.findAll({
        where: { is_active: true },
        order: [['sort_order', 'ASC'], ['year_start', 'ASC']],
        attributes: ['id', 'name', 'period', 'year_start', 'year_end', 'description', 'cover_url', 'sort_order'],
      });
      sendSuccess(res, eras);
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const era = await Era.findByPk(req.params.id);
      if (!era) return sendNotFound(res, 'Không tìm thấy thời đại');
      sendSuccess(res, era);
    } catch (err) { next(err); }
  },
};

module.exports = eraController;
