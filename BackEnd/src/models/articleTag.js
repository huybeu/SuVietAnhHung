import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ArticleTag = sequelize.define(
  'ArticleTag',
  {
    article_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    tag_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  },
  {
    tableName: 'article_tags',
    timestamps: false,
  }
);

export default ArticleTag;
