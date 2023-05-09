const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
// Define the "temples" table
const Temple = sequelize.define('temple', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    templeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timezone: '+05:30'
  });
  module.exports = Temple;
