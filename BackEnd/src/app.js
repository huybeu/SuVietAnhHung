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
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

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

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Sử Việt Anh Hùng API Docs',
    swaggerOptions: { persistAuthorization: true },
  })
);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy', uptime: process.uptime() });
});

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
