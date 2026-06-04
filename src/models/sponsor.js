const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sponsor = sequelize.define(
  'Sponsor',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tier_id: {
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.TEXT,
    },
    website_url: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sponsored_at: {
      type: DataTypes.DATEONLY,
    },
    expires_at: {
      type: DataTypes.DATEONLY,
    },
    created_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'sponsors',
  }
);

module.exports = Sponsor;
