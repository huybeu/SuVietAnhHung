import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ArticleHero = sequelize.define(
  'ArticleHero',
  {
    article_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    hero_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  },
  {
    tableName: 'article_heroes',
    timestamps: false,
  }
);

export default ArticleHero;
