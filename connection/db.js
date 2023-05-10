const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('', '', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30', // set timezone to Asia/Kolkata
  });
  

module.exports = sequelize;
