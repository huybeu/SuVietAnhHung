import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: { msg: 'Username đã tồn tại' },
      validate: {
        notEmpty: { msg: 'Username không được để trống' },
        len: { args: [3, 50], msg: 'Username phải từ 3 đến 50 ký tự' },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Email đã tồn tại' },
      validate: {
        isEmail: { msg: 'Email không hợp lệ' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Mật khẩu không được để trống' },
      },
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'editor', 'viewer'),
      defaultValue: 'editor',
    },
    avatar_url: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

User.prototype.toSafeObject = function () {
  const { password, ...safe } = this.toJSON();
  return safe;
};

export default User;
