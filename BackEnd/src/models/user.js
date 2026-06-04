const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: { msg: 'Username đã tồn tại' },
      validate: {
        notEmpty: { msg: 'Username không được để trống' },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Email đã tồn tại' },
      validate: {
        isEmail: { msg: 'Email không hợp lệ' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'editor', 'viewer'),
      defaultValue: 'editor',
    },
    avatar_url: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'users',
  }
);

module.exports = User;
