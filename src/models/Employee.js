const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  nationalId: {
    type: DataTypes.STRING
  },
  hireDate: {
    type: DataTypes.DATEONLY
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'employees'
});

module.exports = Employee;