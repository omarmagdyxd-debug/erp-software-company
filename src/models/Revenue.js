const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Revenue = sequelize.define('Revenue', {
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
  source: {
    type: DataTypes.ENUM('instapay', 'bank_company_1', 'bank_company_2', 'personal_1', 'personal_2', 'personal_3', 'personal_4'),
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT
  },
  reference: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'revenues'
});

module.exports = Revenue;