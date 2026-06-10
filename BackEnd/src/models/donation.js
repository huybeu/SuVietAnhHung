import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Donation = sequelize.define(
  'Donation',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    public_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    tier_id: {
      type: DataTypes.BIGINT,
    },
    donor_name: {
      type: DataTypes.STRING(100),
    },
    donor_email: {
      type: DataTypes.STRING(100),
    },
    donor_phone: {
      type: DataTypes.STRING(20),
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.ENUM('bank_transfer', 'qr', 'other'),
      defaultValue: 'bank_transfer',
    },
    payment_ref: {
      type: DataTypes.STRING(100),
    },
    confirmed_by: {
      type: DataTypes.BIGINT,
    },
    confirmed_at: {
      type: DataTypes.DATE,
    },
    show_on_board: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'donations',
  }
);

export default Donation;
