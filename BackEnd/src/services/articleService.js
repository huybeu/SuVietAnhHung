import articleRepository from '../repositories/articleRepository.js';
import { Hero, Tag } from '../models/index.js';
import AppError from '../utils/AppError.js';

class ArticleService {
  // ─── Public ─────────────────────────────────────────────────────────────────

  async getPublicArticles({ page = 1, limit = 10, search, tag_id, hero_id, era_id, sort } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await articleRepository.findPublishedWithCount({
      limit: Number(limit),
      offset,
      search,
      tagId: tag_id,
      heroId: hero_id,
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

  async getPublicArticleById(id) {
    const article = await articleRepository.findPublishedById(id);
    if (!article) throw new AppError('Bài viết không tồn tại', 404);
    await articleRepository.incrementViewCount(id);
    return article;
  }

  async getPublicArticleBySlug(slug) {
    const article = await articleRepository.findPublishedBySlug(slug);
    if (!article) throw new AppError('Bài viết không tồn tại', 404);
    await articleRepository.incrementViewCount(article.id);
    return article;
  }

  // ─── Admin ───────────────────────────────────────────────────────────────────

  async getAdminArticles({ page = 1, limit = 10, search, status = 'all', tag_id, hero_id } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await articleRepository.findAdminList({
      limit: Number(limit),
      offset,
      search,
      status,
      tagId: tag_id,
      heroId: hero_id,
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

  async getAdminArticleById(id) {
    const article = await articleRepository.findAdminById(id);
    if (!article) throw new AppError('Bài viết không tồn tại', 404);
    return article;
  }

  async createArticle(data, userId) {
    this._validateArticleData(data, true);

    const slugExists = await articleRepository.findBySlug(data.slug);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    if (data.hero_ids?.length) await this._assertHeroesExist(data.hero_ids);
    if (data.tag_ids?.length) await this._assertTagsExist(data.tag_ids);

    const article = await articleRepository.create({
      title: data.title,
      slug: data.slug,
      image_url: data.image_url || null,
      excerpt: data.excerpt || null,
      content: data.content || null,
      cover_url: data.cover_url || null,
      status: data.status,
      author_id: userId,
      updated_by: userId,
      published_at: data.status === 'published' ? new Date() : null,
    });

    if (data.hero_ids?.length) await article.setHeroes(data.hero_ids);
    if (data.tag_ids?.length) await article.setTags(data.tag_ids);

    return { id: article.id, slug: article.slug };
  }

  async updateArticle(id, data, userId) {
    this._validateArticleData(data, true);

    const existing = await this._assertArticleExists(id);

    const slugExists = await articleRepository.findBySlugExcluding(data.slug, id);
    if (slugExists) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
    }

    if (data.hero_ids?.length) await this._assertHeroesExist(data.hero_ids);
    if (data.tag_ids?.length) await this._assertTagsExist(data.tag_ids);

    const becomesPublished = data.status === 'published' && existing.status !== 'published';

    await articleRepository.update(id, {
      title: data.title,
      slug: data.slug,
      image_url: data.image_url ?? null,
      excerpt: data.excerpt ?? null,
      content: data.content ?? null,
      cover_url: data.cover_url ?? null,
      status: data.status,
      updated_by: userId,
      published_at: becomesPublished ? new Date() : existing.published_at,
    });

    const article = await articleRepository.findById(id);
    await article.setHeroes(data.hero_ids || []);
    await article.setTags(data.tag_ids || []);

    return { id: Number(id) };
  }

  async patchArticle(id, data, userId) {
    const existing = await this._assertArticleExists(id);

    if (data.slug !== undefined) {
      if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
        throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'slug chỉ chứa chữ thường, chữ số và dấu gạch ngang' });
      }
      const slugExists = await articleRepository.findBySlugExcluding(data.slug, id);
      if (slugExists) {
        throw new AppError('Dữ liệu không hợp lệ', 422, { slug: 'Slug đã tồn tại' });
      }
    }

    if (data.status !== undefined && !['draft', 'published', 'archived'].includes(data.status)) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { status: 'status phải là draft, published hoặc archived' });
    }

    if (data.hero_ids !== undefined && data.hero_ids.length) await this._assertHeroesExist(data.hero_ids);
    if (data.tag_ids !== undefined && data.tag_ids.length) await this._assertTagsExist(data.tag_ids);

    const updateData = { updated_by: userId };

    const directFields = ['title', 'slug', 'image_url', 'excerpt', 'content', 'cover_url'];
    directFields.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'published' && existing.status !== 'published') {
        updateData.published_at = new Date();
      }
    }

    await articleRepository.update(id, updateData);

    const article = await articleRepository.findById(id);
    if (data.hero_ids !== undefined) await article.setHeroes(data.hero_ids);
    if (data.tag_ids !== undefined) await article.setTags(data.tag_ids);

    return { id: Number(id) };
  }

  async deleteArticle(id) {
    await this._assertArticleExists(id);
    await articleRepository.delete(id);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  async _assertArticleExists(id) {
    const article = await articleRepository.findById(id);
    if (!article) throw new AppError('Bài viết không tồn tại', 404);
    return article;
  }

  async _assertHeroesExist(heroIds) {
    const found = await Hero.count({ where: { id: heroIds } });
    if (found !== heroIds.length) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { hero_ids: 'Một hoặc nhiều anh hùng không tồn tại' });
    }
  }

  async _assertTagsExist(tagIds) {
    const found = await Tag.count({ where: { id: tagIds } });
    if (found !== tagIds.length) {
      throw new AppError('Dữ liệu không hợp lệ', 422, { tag_ids: 'Một hoặc nhiều tag không tồn tại' });
    }
  }

  _validateArticleData(data, requireAll = false) {
    const errors = {};

    if (requireAll || data.title !== undefined) {
      if (!data.title || String(data.title).trim().length === 0) {
        errors.title = 'title không được để trống';
      } else if (String(data.title).length > 300) {
        errors.title = 'title tối đa 300 ký tự';
      }
    }

    if (requireAll || data.slug !== undefined) {
      if (!data.slug || String(data.slug).trim().length === 0) {
        errors.slug = 'slug không được để trống';
      } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.slug = 'slug chỉ chứa chữ thường, chữ số và dấu gạch ngang';
      } else if (data.slug.length > 300) {
        errors.slug = 'slug tối đa 300 ký tự';
      }
    }

    if (requireAll || data.status !== undefined) {
      if (!['draft', 'published', 'archived'].includes(data.status)) {
        errors.status = 'status phải là draft, published hoặc archived';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError('Dữ liệu không hợp lệ', 422, errors);
    }
  }
}

export default new ArticleService();
