import articleService from '../services/articleService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

// ─── Public ──────────────────────────────────────────────────────────────────

const getPublicArticles = async (req, res, next) => {
  try {
    const { page, limit, search, tag_id, hero_id, era_id, sort } = req.query;
    const result = await articleService.getPublicArticles({ page, limit, search, tag_id, hero_id, era_id, sort });
    return sendSuccess(res, result, 'Lấy danh sách bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const getPublicArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getPublicArticleById(req.params.id);
    return sendSuccess(res, article, 'Lấy bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const getPublicArticleBySlug = async (req, res, next) => {
  try {
    const article = await articleService.getPublicArticleBySlug(req.params.slug);
    return sendSuccess(res, article, 'Lấy bài viết thành công');
  } catch (err) {
    next(err);
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

const getAdminArticles = async (req, res, next) => {
  try {
    const { page, limit, search, status, tag_id, hero_id } = req.query;
    const result = await articleService.getAdminArticles({ page, limit, search, status, tag_id, hero_id });
    return sendSuccess(res, result, 'Lấy danh sách bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const getAdminArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getAdminArticleById(req.params.id);
    return sendSuccess(res, article, 'Lấy bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const result = await articleService.createArticle(req.body, req.user.id);
    return sendCreated(res, result, 'Tạo bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const result = await articleService.updateArticle(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const patchArticle = async (req, res, next) => {
  try {
    const result = await articleService.patchArticle(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    await articleService.deleteArticle(req.params.id);
    return sendSuccess(res, null, 'Xóa bài viết thành công');
  } catch (err) {
    next(err);
  }
};

export {
  getPublicArticles,
  getPublicArticleById,
  getPublicArticleBySlug,
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  patchArticle,
  deleteArticle,
};
