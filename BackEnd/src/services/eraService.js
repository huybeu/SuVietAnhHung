const eraRepository = require('../repositories/eraRepository');
const { Era } = require('../models');
const { sequelize } = require('../config/database');
const AppError = require('../utils/AppError');

class EraService {
  // ─── Public ─────────────────────────────────────────────────────────────────

  async getPublicEras({ page = 1, limit = 10, search, sort } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await eraRepository.findPublishedWithCount({
      limit: Number(limit),
      offset,
      search,
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

  async getPublicEraById(id) {
    const era = await eraRepository.findPublishedById(id);
    if (!era) throw new AppError('Thời kỳ không tồn tại', 404);
    return era;
  }

  async getEraHeroes(id, { page = 1, limit = 10 } = {}) {
    await this._assertEraExists(id);

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await eraRepository.findHeroesByEra(id, {
      limit: Number(limit),
      offset,
    });

    return {
      era_id: Number(id),
      items: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        total_pages: Math.ceil(count / Number(limit)),
      },
    };
  }

  async getEraArticles(id, { page = 1, limit = 10 } = {}) {
    await this._assertEraExists(id);

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await eraRepository.findArticlesByEra(id, {
      limit: Number(limit),
      offset,
    });

    return {
      era_id: Number(id),
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

  async getAdminEras({ page = 1, limit = 10, search, status = 'all' } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await eraRepository.findAdminList({
      limit: Number(limit),
      offset,
      search,
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

  async getAdminEraById(id) {
    const era = await eraRepository.findAdminById(id);
    if (!era) throw new AppError('Thời kỳ không tồn tại', 404);
    return era;
  }

  async createEra(data, userId) {
    this._validateEraData(data, true);

    const slugExists = await eraRepository.findBySlug(data.slug);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    const era = await eraRepository.create({
      name: data.name,
      slug: data.slug,
      start_year: data.start_year,
      end_year: data.end_year,
      description: data.description || null,
      cover_image: data.cover_image || null,
      order: data.order || 0,
      status: data.status,
      created_by: userId,
      updated_by: userId,
    });

    return { id: era.id, slug: era.slug };
  }

  async updateEra(id, data, userId) {
    this._validateEraData(data, true);

    await this._assertEraExists(id);

    const slugExists = await eraRepository.findBySlugExcluding(data.slug, id);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    await eraRepository.update(id, {
      name: data.name,
      slug: data.slug,
      start_year: data.start_year,
      end_year: data.end_year,
      description: data.description ?? null,
      cover_image: data.cover_image ?? null,
      order: data.order ?? 0,
      status: data.status,
      updated_by: userId,
    });

    return { id: Number(id) };
  }

  async patchEra(id, data, userId) {
    await this._assertEraExists(id);

    if (data.slug !== undefined) {
      const slugExists = await eraRepository.findBySlugExcluding(data.slug, id);
      if (slugExists) {
        throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
      }
    }

    if (
      data.start_year !== undefined &&
      data.end_year !== undefined &&
      Number(data.end_year) <= Number(data.start_year)
    ) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        end_year: 'end_year phải lớn hơn start_year',
      });
    }

    if (data.status !== undefined && !['published', 'draft'].includes(data.status)) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        status: 'status phải là published hoặc draft',
      });
    }

    const updateData = { updated_by: userId };
    const allowed = ['name', 'slug', 'start_year', 'end_year', 'description', 'cover_image', 'order', 'status'];
    allowed.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    await eraRepository.update(id, updateData);
    return { id: Number(id) };
  }

  async reorderEras(orders) {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        orders: 'orders phải là mảng không rỗng',
      });
    }

    for (const item of orders) {
      if (!item.id || item.order === undefined || item.order < 1) {
        throw new AppError('Dữ liệu không hợp lệ', 422, {
          orders: 'Mỗi phần tử phải có id và order (≥ 1)',
        });
      }
    }

    const ids = orders.map((o) => o.id);
    const existing = await Era.findAll({ where: { id: ids }, attributes: ['id'] });
    if (existing.length !== ids.length) {
      throw new AppError('Dữ liệu không hợp lệ', 422, {
        orders: 'Một hoặc nhiều id không tồn tại',
      });
    }

    const transaction = await sequelize.transaction();
    try {
      await eraRepository.bulkUpdateOrder(orders, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    return { updated: orders.length };
  }

  async deleteEra(id) {
    await this._assertEraExists(id);

    const heroesCount = await require('../models').Hero.count({ where: { era_id: id } });
    const articlesCount = await eraRepository._countArticlesByEra(id);

    if (heroesCount > 0 || articlesCount > 0) {
      throw new AppError(
        `Không thể xóa — thời kỳ này đang có ${heroesCount} anh hùng và ${articlesCount} bài viết liên kết`,
        409
      );
    }

    await eraRepository.delete(id);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  async _assertEraExists(id) {
    const era = await eraRepository.findById(id, { attributes: ['id'] });
    if (!era) throw new AppError('Thời kỳ không tồn tại', 404);
    return era;
  }

  _validateEraData(data, requireAll = false) {
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

    if (requireAll || (data.start_year !== undefined && data.end_year !== undefined)) {
      if (data.start_year === undefined || data.start_year === null || data.start_year === '') {
        errors.start_year = 'start_year là bắt buộc';
      }
      if (data.end_year === undefined || data.end_year === null || data.end_year === '') {
        errors.end_year = 'end_year là bắt buộc';
      }
      if (!errors.start_year && !errors.end_year) {
        if (Number(data.end_year) <= Number(data.start_year)) {
          errors.end_year = 'end_year phải lớn hơn start_year';
        }
      }
    }

    if (requireAll || data.status !== undefined) {
      if (!['published', 'draft'].includes(data.status)) {
        errors.status = 'status phải là published hoặc draft';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError('Dữ liệu không hợp lệ', 422, errors);
    }
  }
}

module.exports = new EraService();
