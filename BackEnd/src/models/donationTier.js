const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DonationTier = sequelize.define(
  'DonationTier',
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
    amount_min: {
      type: DataTypes.BIGINT,
    },
    amount_max: {
      type: DataTypes.BIGINT,
    },
    perks: {
      type: DataTypes.JSON,
    },
    badge_url: {
      type: DataTypes.TEXT,
    },
    color: {
      type: DataTypes.STRING(20),
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
    tableName: 'donation_tiers',
  }
);

module.exports = DonationTier;
