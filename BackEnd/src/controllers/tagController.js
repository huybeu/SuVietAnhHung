const { Tag } = require('../models');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/response');

const tagController = {
  async list(req, res, next) {
    try {
      const tags = await Tag.findAll({
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'slug'],
      });
      sendSuccess(res, tags);
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const tag = await Tag.create({ ...req.body, created_by: req.user?.id });
      sendCreated(res, tag, 'Tạo tag thành công');
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) return sendNotFound(res, 'Không tìm thấy tag');
      await tag.destroy();
      sendSuccess(res, null, 'Xoá tag thành công');
    } catch (err) { next(err); }
  },
};

module.exports = tagController;
