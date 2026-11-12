import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(160),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'),
    defaultValue: 'ACTIVE',
  },
  criticality: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    defaultValue: 'MEDIUM',
  }
}, {
  timestamps: true,
});