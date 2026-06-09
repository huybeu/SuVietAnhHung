import BaseRepository from './baseRepository.js';
import { Hero, Era, Article, Video, User } from '../models/index.js';
import { Op } from 'sequelize';

class HeroRepository extends BaseRepository {
  constructor() {
    super(Hero);
  }

  async findPublishedWithCount({ limit, offset, search, eraId, sort }) {
    const where = { is_active: true };
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (eraId) where.era_id = eraId;

    return Hero.findAndCountAll({
      where,
      attributes: ['id', 'name', 'slug', 'avatar_url', 'birth_year', 'death_year'],
      include: [
        { model: Era, as: 'era', attributes: ['id', 'name', 'slug'] },
      ],
      order: this._buildOrder(sort),
      limit,
      offset,
      distinct: true,
    });
  }

  async findPublishedById(id) {
    const hero = await Hero.findOne({
      where: { id, is_active: true },
      attributes: ['id', 'name', 'slug', 'avatar_url', 'cover_url', 'birth_year', 'death_year', 'biography'],
      include: [
        { model: Era, as: 'era', attributes: ['id', 'name', 'slug'] },
      ],
    });
    if (!hero) return null;

    const articlesCount = await this._countArticlesByHero(id);
    const videosCount = await Video.count({ where: { hero_id: id } });

    return { ...hero.toJSON(), articles_count: articlesCount, videos_count: videosCount };
  }

  async findArticlesByHero(heroId, { limit, offset }) {
    return Article.findAndCountAll({
      include: [
        {
          model: Hero,
          as: 'heroes',
          required: true,
          where: { id: heroId },
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

  async findVideosByHero(heroId, { limit, offset }) {
    return Video.findAndCountAll({
      where: { hero_id: heroId },
      attributes: ['id', 'title', 'thumbnail_url', 'url', 'platform'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
  }

  async findAdminList({ limit, offset, search, eraId, status }) {
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (eraId) where.era_id = eraId;
    if (status === 'published') where.is_active = true;
    else if (status === 'draft') where.is_active = false;

    const { count, rows } = await Hero.findAndCountAll({
      where,
      include: [
        { model: Era, as: 'era', attributes: ['id', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const items = await Promise.all(
      rows.map(async (hero) => {
        const articlesCount = await this._countArticlesByHero(hero.id);
        const videosCount = await Video.count({ where: { hero_id: hero.id } });
        const plain = hero.toJSON();
        return {
          ...plain,
          status: plain.is_active ? 'published' : 'draft',
          articles_count: articlesCount,
          videos_count: videosCount,
        };
      })
    );

    return { count, rows: items };
  }

  async findAdminById(id) {
    const hero = await Hero.findByPk(id, {
      include: [
        { model: Era, as: 'era', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });
    if (!hero) return null;

    const articlesCount = await this._countArticlesByHero(id);
    const videosCount = await Video.count({ where: { hero_id: id } });
    const plain = hero.toJSON();

    return {
      ...plain,
      status: plain.is_active ? 'published' : 'draft',
      articles_count: articlesCount,
      videos_count: videosCount,
    };
  }

  async findBySlug(slug) {
    return Hero.findOne({ where: { slug } });
  }

  async findBySlugExcluding(slug, excludeId) {
    return Hero.findOne({ where: { slug, id: { [Op.ne]: excludeId } } });
  }

  async _countArticlesByHero(heroId) {
    return Article.count({
      include: [
        {
          model: Hero,
          as: 'heroes',
          required: true,
          where: { id: heroId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      where: { status: 'published' },
      distinct: true,
      col: 'id',
    });
  }

  _buildOrder(sort) {
    switch (sort) {
      case 'name_asc': return [['name', 'ASC']];
      case 'name_desc': return [['name', 'DESC']];
      case 'birth_year_asc': return [['birth_year', 'ASC']];
      case 'birth_year_desc': return [['birth_year', 'DESC']];
      default: return [['sort_order', 'ASC'], ['name', 'ASC']];
    }
  }
}

export default new HeroRepository();
