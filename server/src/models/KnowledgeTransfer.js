import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const KnowledgeTransfer = sequelize.define('KnowledgeTransfer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
    defaultValue: 'PENDING',
  },
  deadline: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});