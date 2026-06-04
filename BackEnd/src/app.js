/**
 * App Entry Point
 *
 * Cấu hình và khởi tạo Express application.
 * Đăng ký global middleware (JSON parser, CORS, v.v.) và mount toàn bộ routes.
 * File này không khởi động server — việc đó thuộc về server.js để tiện test.
 */

const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy', uptime: process.uptime() });
});

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
