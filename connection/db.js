const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hksoftwe_idd', 'hksoftwe', 'p7]8tzVE+13yVH', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30', // set timezone to Asia/Kolkata
  });
  

module.exports = sequelize;
