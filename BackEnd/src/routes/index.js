/**
 * Routes Index
 *
 * Tập trung đăng ký tất cả route vào Express app với prefix /api/v1.
 * Thêm resource mới: import router tương ứng và mount vào đây.
 * Cũng xử lý route 404 cho các path không tồn tại.
 */

const express = require('express');
const router = express.Router();
const authRoutes    = require('./authRoutes');
const userRoutes    = require('./userRoutes');
const articleRoutes = require('./articleRoutes');
const heroRoutes    = require('./heroRoutes');
const eraRoutes     = require('./eraRoutes');
const tagRoutes     = require('./tagRoutes');
const AppError      = require('../utils/AppError');

router.use('/auth',     authRoutes);
router.use('/users',    userRoutes);
router.use('/articles', articleRoutes);
router.use('/heroes',   heroRoutes);
router.use('/eras',     eraRoutes);
router.use('/tags',     tagRoutes);

// Catch-all cho route không tồn tại
router.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy route: ${req.method} ${req.originalUrl}`, 404));
});

module.exports = router;
