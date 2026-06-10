import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Hero = sequelize.define(
  'Hero',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    era_id: {
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    birth_year: {
      type: DataTypes.INTEGER,
    },
    death_year: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING(200),
    },
    biography: {
      type: DataTypes.TEXT('long'),
    },
    avatar_url: {
      type: DataTypes.TEXT,
    },
    cover_url: {
      type: DataTypes.TEXT,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'heroes',
  }
);

export default Hero;
