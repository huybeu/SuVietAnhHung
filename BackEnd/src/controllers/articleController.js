const { Article, Hero, Tag, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

const FEATURED_LIMIT = 5;

const articleController = {
  async list(req, res, next) {
    try {
      const {
        page = 1, limit = 12, q, status, is_featured, hero, tag,
        sortBy = 'publishedAt', sortDir = 'DESC',
      } = req.query;

      const where = {};
      if (q) {
        where[Op.or] = [
          { title: { [Op.like]: `%${q}%` } },
          { excerpt: { [Op.like]: `%${q}%` } },
        ];
      }
      if (status) where.status = status;
      if (is_featured !== undefined) where.is_featured = is_featured === 'true';

      const offset = (Number(page) - 1) * Number(limit);
      const allowedSort = { publishedAt: 'published_at', createdAt: 'createdAt', title: 'title', viewCount: 'view_count' };
      const orderCol = allowedSort[sortBy] || 'published_at';
      const order = [[orderCol, sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];

      const include = [
        { model: Hero, as: 'heroes', attributes: ['id', 'name', 'slug', 'avatar_url'], through: { attributes: [] } },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
        { model: User, as: 'author', attributes: ['id', 'username'] },
      ];

      // Filter by hero id
      if (hero) {
        include[0] = { ...include[0], where: { id: hero }, required: true };
      }

      // Filter by tag slug
      if (tag) {
        const tagSlugs = tag.split(',').filter(Boolean);
        include[1] = { ...include[1], where: { slug: { [Op.in]: tagSlugs } }, required: true };
      }

      const { count, rows } = await Article.findAndCountAll({
        where, offset, limit: Number(limit), order, include, distinct: true,
      });

      sendSuccess(res, rows, 'Thành công', 200, {
        total: count, page: Number(page), limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const article = await Article.findByPk(req.params.id, {
        include: [
          { model: Hero, as: 'heroes', attributes: ['id', 'name', 'slug', 'avatar_url'], through: { attributes: [] } },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
          { model: User, as: 'author', attributes: ['id', 'username'] },
        ],
      });
      if (!article) return sendNotFound(res, 'Không tìm thấy bài viết');
      sendSuccess(res, article);
    } catch (err) { next(err); }
  },

  async getBySlug(req, res, next) {
    try {
      const article = await Article.findOne({
        where: { slug: req.params.slug },
        include: [
          { model: Hero, as: 'heroes', attributes: ['id', 'name', 'slug', 'avatar_url'], through: { attributes: [] } },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
          { model: User, as: 'author', attributes: ['id', 'username'] },
        ],
      });
      if (!article) return sendNotFound(res, 'Không tìm thấy bài viết');
      // Increment view count (fire-and-forget)
      article.increment('view_count').catch(() => {});
      sendSuccess(res, article);
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { hero_ids, tag_ids, ...data } = req.body;
      const article = await Article.create({ ...data, author_id: req.user?.id });

      if (Array.isArray(hero_ids) && hero_ids.length) await article.setHeroes(hero_ids);
      if (Array.isArray(tag_ids) && tag_ids.length) await article.setTags(tag_ids);

      const result = await Article.findByPk(article.id, {
        include: [
          { model: Hero, as: 'heroes', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
        ],
      });
      sendCreated(res, result, 'Tạo bài viết thành công');
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return sendNotFound(res, 'Không tìm thấy bài viết');

      const { hero_ids, tag_ids, ...data } = req.body;
      await article.update({ ...data, updated_by: req.user?.id });

      if (Array.isArray(hero_ids)) await article.setHeroes(hero_ids);
      if (Array.isArray(tag_ids)) await article.setTags(tag_ids);

      const result = await Article.findByPk(article.id, {
        include: [
          { model: Hero, as: 'heroes', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
        ],
      });
      sendSuccess(res, result, 'Cập nhật thành công');
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return sendNotFound(res, 'Không tìm thấy bài viết');
      await article.destroy();
      sendSuccess(res, null, 'Xoá thành công');
    } catch (err) { next(err); }
  },

  async toggleFeatured(req, res, next) {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return sendNotFound(res, 'Không tìm thấy bài viết');

      const newVal = !article.is_featured;
      if (newVal) {
        const count = await Article.count({ where: { is_featured: true, id: { [Op.ne]: article.id } } });
        if (count >= FEATURED_LIMIT) {
          return sendBadRequest(res, `Chỉ được phép tối đa ${FEATURED_LIMIT} bài viết nổi bật`);
        }
      }
      await article.update({ is_featured: newVal, updated_by: req.user?.id });
      sendSuccess(res, article, newVal ? 'Đã đánh dấu nổi bật' : 'Đã bỏ đánh dấu nổi bật');
    } catch (err) { next(err); }
  },
};

module.exports = articleController;
