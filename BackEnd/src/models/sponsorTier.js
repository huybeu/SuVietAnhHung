import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SponsorTier = sequelize.define(
  'SponsorTier',
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
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'sponsor_tiers',
  }
);

export default SponsorTier;
