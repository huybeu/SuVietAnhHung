const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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

module.exports = ArticleTag;
