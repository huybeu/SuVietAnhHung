import BaseRepository from './baseRepository.js';
import { Era, Hero, Article, ArticleHero, User } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

class EraRepository extends BaseRepository {
  constructor() {
    super(Era);
  }

  async findPublishedWithCount({ limit, offset, search, sort }) {
    const where = { status: 'published' };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const order = sort === 'order_desc' ? [['order', 'DESC']] : [['order', 'ASC']];

    return Era.findAndCountAll({
      where,
      attributes: [
        'id', 'name', 'slug', 'start_year', 'end_year',
        'description', 'cover_image', 'order',
      ],
      order,
      limit,
      offset,
    });
  }

  async findPublishedById(id) {
    const era = await Era.findOne({
      where: { id, status: 'published' },
      attributes: [
        'id', 'name', 'slug', 'start_year', 'end_year',
        'description', 'cover_image', 'order',
      ],
    });
    if (!era) return null;

    const heroesCount = await Hero.count({ where: { era_id: id } });
    const articlesCount = await this._countArticlesByEra(id);

    return { ...era.toJSON(), heroes_count: heroesCount, articles_count: articlesCount };
  }

  async findHeroesByEra(eraId, { limit, offset }) {
    return Hero.findAndCountAll({
      where: { era_id: eraId },
      attributes: ['id', 'name', 'slug', 'avatar_url', 'birth_year', 'death_year'],
      order: [['sort_order', 'ASC']],
      limit,
      offset,
    });
  }

  async findArticlesByEra(eraId, { limit, offset }) {
    return Article.findAndCountAll({
      include: [
        {
          model: Hero,
          as: 'heroes',
          required: true,
          where: { era_id: eraId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'cover_url', 'published_at'],
      distinct: true,
      order: [['published_at', 'DESC']],
      limit,
      offset,
    });
  }

  async findAdminList({ limit, offset, search, status }) {
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (status && status !== 'all') where.status = status;

    const { count, rows } = await Era.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
      order: [['order', 'ASC'], ['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const items = await Promise.all(
      rows.map(async (era) => {
        const heroesCount = await Hero.count({ where: { era_id: era.id } });
        const articlesCount = await this._countArticlesByEra(era.id);
        return {
          ...era.toJSON(),
          heroes_count: heroesCount,
          articles_count: articlesCount,
        };
      })
    );

    return { count, rows: items };
  }

  async findAdminById(id) {
    const era = await Era.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });
    if (!era) return null;

    const heroesCount = await Hero.count({ where: { era_id: id } });
    const articlesCount = await this._countArticlesByEra(id);

    return { ...era.toJSON(), heroes_count: heroesCount, articles_count: articlesCount };
  }

  async findBySlug(slug) {
    return Era.findOne({ where: { slug } });
  }

  async findBySlugExcluding(slug, excludeId) {
    return Era.findOne({ where: { slug, id: { [Op.ne]: excludeId } } });
  }

  async _countArticlesByEra(eraId) {
    const result = await Article.count({
      include: [
        {
          model: Hero,
          as: 'heroes',
          required: true,
          where: { era_id: eraId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      where: { status: 'published' },
      distinct: true,
      col: 'id',
    });
    return result;
  }

  async bulkUpdateOrder(orders, transaction) {
    const updates = orders.map(({ id, order }) =>
      Era.update({ order }, { where: { id }, transaction })
    );
    return Promise.all(updates);
  }
}

export default new EraRepository();
