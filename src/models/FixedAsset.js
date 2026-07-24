const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FixedAsset = sequelize.define('FixedAsset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('equipment', 'furniture', 'vehicles', 'computers', 'other'),
    defaultValue: 'other'
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  purchaseValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  usefulLifeYears: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  depreciationRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 20
  },
  currentValue: {
    type: DataTypes.DECIMAL(15, 2)
  },
  source: {
    type: DataTypes.ENUM('instapay', 'bank_company_1', 'bank_company_2', 'personal_1', 'personal_2', 'personal_3', 'personal_4'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'disposed', 'maintenance'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'fixed_assets'
});

module.exports = FixedAsset;