/**
 * App Entry Point
 *
 * Cấu hình và khởi tạo Express application.
 * Đăng ký global middleware (JSON parser, CORS, v.v.) và mount toàn bộ routes.
 * File này không khởi động server — việc đó thuộc về server.js để tiện test.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Không được phép bởi CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy', uptime: process.uptime() });
});

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
