/**
 * Server Bootstrap
 *
 * Điểm khởi động duy nhất của ứng dụng.
 * Load biến môi trường → kết nối database → khởi động HTTP server.
 * Xử lý graceful shutdown và các unhandled error ở cấp process.
 */

require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`Môi trường: ${process.env.NODE_ENV || 'development'}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM nhận được. Đang tắt server...');
    server.close(() => process.exit(0));
  });
};

startServer().catch((err) => {
  console.error('Không thể khởi động server:', err.message);
  process.exit(1);
});
