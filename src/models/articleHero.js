const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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

module.exports = ArticleHero;
