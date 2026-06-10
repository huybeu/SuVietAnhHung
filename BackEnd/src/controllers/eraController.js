import eraService from '../services/eraService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

// ─── Public ──────────────────────────────────────────────────────────────────

const getPublicEras = async (req, res, next) => {
  try {
    const { page, limit, search, sort } = req.query;
    const result = await eraService.getPublicEras({ page, limit, search, sort });
    return sendSuccess(res, result, 'Lấy danh sách thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

const getPublicEraById = async (req, res, next) => {
  try {
    const era = await eraService.getPublicEraById(req.params.id);
    return sendSuccess(res, era, 'Lấy thông tin thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

const getEraHeroes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await eraService.getEraHeroes(req.params.id, { page, limit });
    return sendSuccess(res, result, 'Lấy danh sách anh hùng thành công');
  } catch (err) {
    next(err);
  }
};

const getEraArticles = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await eraService.getEraArticles(req.params.id, { page, limit });
    return sendSuccess(res, result, 'Lấy danh sách bài viết thành công');
  } catch (err) {
    next(err);
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

const getAdminEras = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await eraService.getAdminEras({ page, limit, search, status });
    return sendSuccess(res, result, 'Lấy danh sách thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

const getAdminEraById = async (req, res, next) => {
  try {
    const era = await eraService.getAdminEraById(req.params.id);
    return sendSuccess(res, era, 'Lấy thông tin thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

const createEra = async (req, res, next) => {
  try {
    const result = await eraService.createEra(req.body, req.user.id);
    return sendCreated(res, result, 'Tạo thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

const updateEra = async (req, res, next) => {
  try {
    const result = await eraService.updateEra(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật thành công');
  } catch (err) {
    next(err);
  }
};

const patchEra = async (req, res, next) => {
  try {
    const result = await eraService.patchEra(req.params.id, req.body, req.user.id);
    return sendSuccess(res, result, 'Cập nhật thành công');
  } catch (err) {
    next(err);
  }
};

const reorderEras = async (req, res, next) => {
  try {
    const result = await eraService.reorderEras(req.body.orders);
    return sendSuccess(res, result, 'Sắp xếp thành công');
  } catch (err) {
    next(err);
  }
};

const deleteEra = async (req, res, next) => {
  try {
    await eraService.deleteEra(req.params.id);
    return sendSuccess(res, null, 'Xóa thời kỳ thành công');
  } catch (err) {
    next(err);
  }
};

export {
  getPublicEras,
  getPublicEraById,
  getEraHeroes,
  getEraArticles,
  getAdminEras,
  getAdminEraById,
  createEra,
  updateEra,
  patchEra,
  reorderEras,
  deleteEra,
};
