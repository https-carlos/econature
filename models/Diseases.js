const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database'); 

const Diseases = sequelize.define('Diseases', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
});

module.exports = Diseases;
