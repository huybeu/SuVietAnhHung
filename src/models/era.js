const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Era = sequelize.define(
  'Era',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING(100),
    },
    year_start: {
      type: DataTypes.INTEGER,
    },
    year_end: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cover_url: {
      type: DataTypes.TEXT,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'eras',
  }
);

module.exports = Era;
