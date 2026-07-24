const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  partnerSharePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  hasContract: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  contractValue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  contractType: {
    type: DataTypes.ENUM('fixed', 'installments'),
    defaultValue: 'fixed'
  },
  startDate: {
    type: DataTypes.DATEONLY
  },
  endDate: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'suspended'),
    defaultValue: 'active'
  },
  description: {
    type: DataTypes.TEXT
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'projects'
});

module.exports = Project;