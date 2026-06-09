import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PageView = sequelize.define(
  'PageView',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING(300),
    },
    referrer: {
      type: DataTypes.TEXT,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    ip_hash: {
      type: DataTypes.STRING(64),
    },
  },
  {
    tableName: 'page_views',
    updatedAt: false,
  }
);

export default PageView;
