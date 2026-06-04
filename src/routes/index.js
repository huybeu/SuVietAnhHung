/**
 * Routes Index
 *
 * Tập trung đăng ký tất cả route vào Express app với prefix /api/v1.
 * Thêm resource mới: import router tương ứng và mount vào đây.
 * Cũng xử lý route 404 cho các path không tồn tại.
 */

const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const AppError = require('../utils/AppError');

router.use('/users', userRoutes);

// Catch-all cho route không tồn tại
router.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy route: ${req.method} ${req.originalUrl}`, 404));
});

module.exports = router;
