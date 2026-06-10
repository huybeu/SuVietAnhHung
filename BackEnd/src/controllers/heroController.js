import heroService from '../services/heroService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

// ─── Public ──────────────────────────────────────────────────────────────────

const getPublicHeroes = async (req, res, next) => {
  try {
    const { page, limit, search, era_id, sort } = req.query;
    const result = await heroService.getPublicHeroes({ page, limit, search, era_id, sort });
    return sendSuccess(res, result, 'Lấy danh sách anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const getPublicHeroById = async (req, res, next) => {
  try {
    const hero = await heroService.getPublicHeroById(req.params.id);
    return sendSuccess(res, hero, 'Lấy thông tin anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const getHeroArticles = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await heroService.getHeroArticles(req.params.id, { page, limit });
    return sendSuccess(res, result, 'Lấy danh sách bài viết thành công');
  } catch (err) {
    next(err);
  }
};

const getHeroVideos = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await heroService.getHeroVideos(req.params.id, { page, limit });
    return sendSuccess(res, result, 'Lấy danh sách video thành công');
  } catch (err) {
    next(err);
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

const getAdminHeroes = async (req, res, next) => {
  try {
    const { page, limit, search, era_id, status } = req.query;
    const result = await heroService.getAdminHeroes({ page, limit, search, era_id, status });
    return sendSuccess(res, result, 'Lấy danh sách anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const getAdminHeroById = async (req, res, next) => {
  try {
    const hero = await heroService.getAdminHeroById(req.params.id);
    return sendSuccess(res, hero, 'Lấy thông tin anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const createHero = async (req, res, next) => {
  try {
    const result = await heroService.createHero(req.body, req.user.id);
    return sendCreated(res, result, 'Tạo anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const result = await heroService.updateHero(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật thành công');
  } catch (err) {
    next(err);
  }
};

const patchHero = async (req, res, next) => {
  try {
    const result = await heroService.patchHero(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật thành công');
  } catch (err) {
    next(err);
  }
};

const deleteHero = async (req, res, next) => {
  try {
    await heroService.deleteHero(req.params.id);
    return sendSuccess(res, null, 'Xóa anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

export {
  getPublicHeroes,
  getPublicHeroById,
  getHeroArticles,
  getHeroVideos,
  getAdminHeroes,
  getAdminHeroById,
  createHero,
  updateHero,
  patchHero,
  deleteHero,
};
