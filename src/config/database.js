/**
 * Database Configuration
 *
 * Khởi tạo và quản lý kết nối Sequelize với MySQL.
 * Đọc thông tin kết nối từ biến môi trường (.env).
 * Export instance Sequelize dùng chung toàn ứng dụng.
 */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const connectDatabase = async () => {
  await sequelize.authenticate();
  console.log('Kết nối database thành công.');

};

module.exports = { sequelize, connectDatabase };
