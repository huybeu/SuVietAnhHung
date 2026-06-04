const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PageView = sequelize.define(
  'PageView',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING(300),
    },
    referrer: {
      type: DataTypes.TEXT,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    ip_hash: {
      type: DataTypes.STRING(64),
    },
  },
  {
    tableName: 'page_views',
    updatedAt: false,
  }
);

module.exports = PageView;
