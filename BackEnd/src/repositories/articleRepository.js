import BaseRepository from './baseRepository.js';
import { Article, Hero, Tag, Era, User } from '../models/index.js';
import { Op } from 'sequelize';

class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article);
  }

  async findPublishedWithCount({ limit, offset, search, tagId, heroId, eraId, sort }) {
    const where = { status: 'published' };
    if (search) where.title = { [Op.like]: `%${search}%` };

    const heroInclude = {
      model: Hero,
      as: 'heroes',
      through: { attributes: [] },
      attributes: ['id', 'name', 'slug'],
      required: !!heroId || !!eraId,
      ...(heroId ? { where: { id: heroId } } : {}),
    };
    if (eraId) {
      heroInclude.include = [{ model: Era, as: 'era', where: { id: eraId }, attributes: [] }];
    }

    return Article.findAndCountAll({
      where,
      attributes: ['id', 'title', 'slug', 'image_url', 'excerpt', 'cover_url', 'published_at', 'view_count'],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug'],
          required: !!tagId,
          ...(tagId ? { where: { id: tagId } } : {}),
        },
        heroInclude,
      ],
      order: this._buildOrder(sort),
      limit,
      offset,
      distinct: true,
    });
  }

  async findPublishedById(id) {
    return Article.findOne({
      where: { id, status: 'published' },
      attributes: ['id', 'title', 'slug', 'image_url', 'excerpt', 'content', 'cover_url', 'published_at', 'view_count'],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Tag, as: 'tags', through: { attributes: [] }, attributes: ['id', 'name', 'slug'] },
        { model: Hero, as: 'heroes', through: { attributes: [] }, attributes: ['id', 'name', 'slug', 'avatar_url'] },
      ],
    });
  }

  async findPublishedBySlug(slug) {
    return Article.findOne({
      where: { slug, status: 'published' },
      attributes: ['id', 'title', 'slug', 'image_url', 'excerpt', 'content', 'cover_url', 'published_at', 'view_count'],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Tag, as: 'tags', through: { attributes: [] }, attributes: ['id', 'name', 'slug'] },
        { model: Hero, as: 'heroes', through: { attributes: [] }, attributes: ['id', 'name', 'slug', 'avatar_url'] },
      ],
    });
  }

  async incrementViewCount(id) {
    return Article.increment('view_count', { where: { id } });
  }

  async findAdminList({ limit, offset, search, status, tagId, heroId }) {
    const where = {};
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (status && status !== 'all') where.status = status;

    return Article.findAndCountAll({
      where,
      attributes: ['id', 'title', 'slug', 'image_url', 'status', 'view_count', 'published_at', 'created_at', 'updated_at'],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug'],
          required: !!tagId,
          ...(tagId ? { where: { id: tagId } } : {}),
        },
        {
          model: Hero,
          as: 'heroes',
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug'],
          required: !!heroId,
          ...(heroId ? { where: { id: heroId } } : {}),
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
  }

  async findAdminById(id) {
    return Article.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
        { model: Tag, as: 'tags', through: { attributes: [] }, attributes: ['id', 'name', 'slug'] },
        { model: Hero, as: 'heroes', through: { attributes: [] }, attributes: ['id', 'name', 'slug', 'avatar_url'] },
      ],
    });
  }

  async findBySlug(slug) {
    return Article.findOne({ where: { slug } });
  }

  async findBySlugExcluding(slug, excludeId) {
    return Article.findOne({ where: { slug, id: { [Op.ne]: excludeId } } });
  }

  _buildOrder(sort) {
    switch (sort) {
      case 'title_asc':   return [['title', 'ASC']];
      case 'title_desc':  return [['title', 'DESC']];
      case 'oldest':      return [['published_at', 'ASC']];
      case 'most_viewed': return [['view_count', 'DESC']];
      default:            return [['published_at', 'DESC']];
    }
  }
}

export default new ArticleRepository();
