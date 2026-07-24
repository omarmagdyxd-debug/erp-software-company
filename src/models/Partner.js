const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  sharePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'partners'
});

module.exports = Partner;