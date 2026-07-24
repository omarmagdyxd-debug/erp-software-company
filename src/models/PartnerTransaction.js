const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PartnerTransaction = sequelize.define('PartnerTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('withdrawal', 'deposit'),
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
  description: {
    type: DataTypes.TEXT
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'partner_transactions'
});

module.exports = PartnerTransaction;