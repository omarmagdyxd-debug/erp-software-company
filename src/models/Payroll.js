const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payroll = sequelize.define('Payroll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  additions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  insuranceDeduction: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  subscriptionDeduction: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  penaltyDeduction: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  netSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  source: {
    type: DataTypes.ENUM('instapay', 'bank_company_1', 'bank_company_2', 'personal_1', 'personal_2', 'personal_3', 'personal_4'),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'payrolls'
});

module.exports = Payroll;