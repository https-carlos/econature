const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Compra = sequelize.define('Compra', {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


module.exports = Compra;
