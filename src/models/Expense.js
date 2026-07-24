const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('general', 'admin', 'operational', 'project'),
    defaultValue: 'general'
  },
  source: {
    type: DataTypes.ENUM('instapay', 'bank_company_1', 'bank_company_2', 'personal_1', 'personal_2', 'personal_3', 'personal_4'),
    allowNull: false
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  custodyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'expenses'
});

module.exports = Expense;