import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const KnowledgeRecord = sequelize.define('KnowledgeRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('PROJECT', 'TECHNOLOGY', 'TASK', 'PROCESS', 'DECISION', 'TROUBLESHOOTING', 'CONTACT', 'OTHER'),
    defaultValue: 'OTHER',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isCritical: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
});