import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Video = sequelize.define(
  'Video',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
    },
    embed_url: {
      type: DataTypes.TEXT,
    },
    platform: {
      type: DataTypes.ENUM('youtube', 'tiktok', 'facebook', 'other'),
    },
    thumbnail_url: {
      type: DataTypes.TEXT,
    },
    duration_sec: {
      type: DataTypes.INTEGER,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hero_id: {
      type: DataTypes.BIGINT,
    },
    era_id: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'published',
    },
    published_at: {
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'videos',
  }
);

export default Video;
