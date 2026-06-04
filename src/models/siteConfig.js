const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteConfig = sequelize.define(
  'SiteConfig',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
    },
    value_type: {
      type: DataTypes.ENUM('type_string', 'type_number', 'type_boolean', 'type_json'),
      defaultValue: 'type_string',
    },
    group: {
      type: DataTypes.ENUM('general', 'hero', 'contact', 'fundraising'),
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'site_config',
    createdAt: false,
  }
);

module.exports = SiteConfig;
