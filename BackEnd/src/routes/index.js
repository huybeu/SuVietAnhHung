/**
 * Routes Index
 *
 * Tập trung đăng ký tất cả route vào Express app với prefix /api/v1.
 * Thêm resource mới: import router tương ứng và mount vào đây.
 * Cũng xử lý route 404 cho các path không tồn tại.
 */

import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import eraRoutes from './eraRoutes.js';
import adminEraRoutes from './adminEraRoutes.js';
import heroRoutes from './heroRoutes.js';
import adminHeroRoutes from './adminHeroRoutes.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/eras', eraRoutes);
router.use('/admin/eras', adminEraRoutes);
router.use('/heroes', heroRoutes);
router.use('/admin/heroes', adminHeroRoutes);

// Catch-all cho route không tồn tại
router.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy route: ${req.method} ${req.originalUrl}`, 404));
});

export default router;
