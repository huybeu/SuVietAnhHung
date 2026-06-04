const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define(
  'Media',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    original_name: {
      type: DataTypes.STRING(255),
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING(100),
    },
    size_bytes: {
      type: DataTypes.BIGINT,
    },
    uploaded_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'media',
  }
);

module.exports = Media;
