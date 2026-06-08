/**
 * Routes Index
 *
 * Tập trung đăng ký tất cả route vào Express app với prefix /api/v1.
 * Thêm resource mới: import router tương ứng và mount vào đây.
 * Cũng xử lý route 404 cho các path không tồn tại.
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const eraRoutes = require('./eraRoutes');
const adminEraRoutes = require('./adminEraRoutes');
const heroRoutes = require('./heroRoutes');
const adminHeroRoutes = require('./adminHeroRoutes');
const AppError = require('../utils/AppError');

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

module.exports = router;
