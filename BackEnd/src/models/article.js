import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Article = sequelize.define(
  'Article',
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
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT('long'),
    },
    cover_url: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    author_id: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
    published_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'articles',
  }
);

export default Article;
