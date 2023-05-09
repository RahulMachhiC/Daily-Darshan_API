const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Temples = require('../models/temple'); // Import Temples model

// Define SringarDarshan model
const SringarDarshan = sequelize.define('SringarDarshan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      templeid: {
        type: DataTypes.INTEGER,
        references: {
          model: Temples,
          key: "id",
        },
      },
      created_At: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,

      },
      updated_At: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },{
    timestamps: false,

  } );
  
  // Define association between ManglaDarshan and Temples
//   ManglaDarshan.belongsTo(Temples);
  
  // Export ManglaDarshan model
module.exports = SringarDarshan;