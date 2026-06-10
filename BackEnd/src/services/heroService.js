import heroRepository from '../repositories/heroRepository.js';
import { Era, Video } from '../models/index.js';
import AppError from '../utils/AppError.js';

class HeroService {
  // ─── Public ─────────────────────────────────────────────────────────────────

  async getPublicHeroes({ page = 1, limit = 10, search, era_id, sort } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await heroRepository.findPublishedWithCount({
      limit: Number(limit),
      offset,
      search,
      eraId: era_id,
      sort,
    });

    return {
      items: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        total_pages: Math.ceil(count / Number(limit)),
      },
    };
  }

  async getPublicHeroById(id) {
    const hero = await heroRepository.findPublishedById(id);
    if (!hero) throw new AppError('Anh hùng không tồn tại', 404);
    return hero;
  }

  async getHeroArticles(id, { page = 1, limit = 10 } = {}) {
    await this._assertHeroExists(id);

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await heroRepository.findArticlesByHero(id, {
      limit: Number(limit),
      offset,
    });

    return {
      hero_id: Number(id),
      items: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        total_pages: Math.ceil(count / Number(limit)),
      },
    };
  }

  async getHeroVideos(id, { page = 1, limit = 10 } = {}) {
    await this._assertHeroExists(id);

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await heroRepository.findVideosByHero(id, {
      limit: Number(limit),
      offset,
    });

    return {
      hero_id: Number(id),
      items: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        total_pages: Math.ceil(count / Number(limit)),
      },
    };
  }

  // ─── Admin ───────────────────────────────────────────────────────────────────

  async getAdminHeroes({ page = 1, limit = 10, search, era_id, status = 'all' } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await heroRepository.findAdminList({
      limit: Number(limit),
      offset,
      search,
      eraId: era_id,
      status,
    });

    return {
      items: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        total_pages: Math.ceil(count / Number(limit)),
      },
    };
  }

  async getAdminHeroById(id) {
    const hero = await heroRepository.findAdminById(id);
    if (!hero) throw new AppError('Anh hùng không tồn tại', 404);
    return hero;
  }

  async createHero(data, userId) {
    this._validateHeroData(data, true);

    const slugExists = await heroRepository.findBySlug(data.slug);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    const eraExists = await Era.findByPk(data.era_id, { attributes: ['id'] });
    if (!eraExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { era_id: 'Thời kỳ không tồn tại' });
    }

    const hero = await heroRepository.create({
      name: data.name,
      slug: data.slug,
      era_id: data.era_id,
      avatar_url: data.avatar || null,
      cover_url: data.cover_image || null,
      birth_year: data.birth_year ?? null,
      death_year: data.death_year ?? null,
      biography: data.biography || null,
      is_active: data.status === 'published',
      created_by: userId,
      updated_by: userId,
    });

    return { id: hero.id, slug: hero.slug };
  }

  async updateHero(id, data, userId) {
    this._validateHeroData(data, true);

    await this._assertHeroExists(id);

    const slugExists = await heroRepository.findBySlugExcluding(data.slug, id);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    const eraExists = await Era.findByPk(data.era_id, { attributes: ['id'] });
    if (!eraExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { era_id: 'Thời kỳ không tồn tại' });
    }

    await heroRepository.update(id, {
      name: data.name,
      slug: data.slug,
      era_id: data.era_id,
      avatar_url: data.avatar ?? null,
      cover_url: data.cover_image ?? null,
      birth_year: data.birth_year ?? null,
      death_year: data.death_year ?? null,
      biography: data.biography ?? null,
      is_active: data.status === 'published',
      updated_by: userId,
    });

    return { id: Number(id) };
  }

  async patchHero(id, data, userId) {
    await this._assertHeroExists(id);

    if (data.slug !== undefined) {
      const slugExists = await heroRepository.findBySlugExcluding(data.slug, id);
      if (slugExists) {
        throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
      }
    }

    if (data.era_id !== undefined) {
      const eraExists = await Era.findByPk(data.era_id, { attributes: ['id'] });
      if (!eraExists) {
        throw new AppError('Dữ liệu không hợp lệ', 422, { era_id: 'Thời kỳ không tồn tại' });
      }
    }

    if (
      data.birth_year !== undefined &&
      data.death_year !== undefined &&
      Number(data.death_year) <= Number(data.birth_year)
    ) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        death_year: 'death_year phải lớn hơn birth_year',
      });
    }

    if (data.status !== undefined && !['published', 'draft'].includes(data.status)) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        status: 'status phải là published hoặc draft',
      });
    }

    const updateData = { updated_by: userId };

    const directFields = ['name', 'slug', 'era_id', 'biography', 'birth_year', 'death_year'];
    directFields.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    if (data.avatar !== undefined) updateData.avatar_url = data.avatar;
    if (data.cover_image !== undefined) updateData.cover_url = data.cover_image;
    if (data.status !== undefined) updateData.is_active = data.status === 'published';

    await heroRepository.update(id, updateData);
    return { id: Number(id) };
  }

  async deleteHero(id) {
    await this._assertHeroExists(id);

    const articlesCount = await heroRepository._countArticlesByHero(id);
    const videosCount = await Video.count({ where: { hero_id: id } });

    if (articlesCount > 0 || videosCount > 0) {
      throw new AppError(
        `Không thể xóa — anh hùng này đang liên kết với ${articlesCount} bài viết và ${videosCount} video`,
        409
      );
    }

    await heroRepository.delete(id);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  async _assertHeroExists(id) {
    const hero = await heroRepository.findById(id, { attributes: ['id'] });
    if (!hero) throw new AppError('Anh hùng không tồn tại', 404);
    return hero;
  }

  _validateHeroData(data, requireAll = false) {
    const errors = {};

    if (requireAll || data.name !== undefined) {
      if (!data.name || String(data.name).trim().length === 0) {
        errors.name = 'name không được để trống';
      } else if (String(data.name).length > 255) {
        errors.name = 'name tối đa 255 ký tự';
      }
    }

    if (requireAll || data.slug !== undefined) {
      if (!data.slug || String(data.slug).trim().length === 0) {
        errors.slug = 'slug không được để trống';
      } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.slug = 'slug chỉ chứa chữ thường, chữ số và dấu gạch ngang';
      }
    }

    if (requireAll || data.era_id !== undefined) {
      if (!data.era_id) {
        errors.era_id = 'era_id là bắt buộc';
      }
    }

    if (requireAll || data.status !== undefined) {
      if (!['published', 'draft'].includes(data.status)) {
        errors.status = 'status phải là published hoặc draft';
      }
    }

    if (
      data.birth_year !== undefined && data.death_year !== undefined &&
      data.birth_year !== null && data.death_year !== null
    ) {
      if (Number(data.death_year) <= Number(data.birth_year)) {
        errors.death_year = 'death_year phải lớn hơn birth_year';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError('Dữ liệu không hợp lệ', 422, errors);
    }
  }
}

export default new HeroService();
