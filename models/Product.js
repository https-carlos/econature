const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Product = sequelize.define('Product', {
  name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  description: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  price: {
      type: DataTypes.FLOAT,
      allowNull: false,
  },
  category: {
      type: DataTypes.STRING,  // ou o tipo de dados que você preferir
      allowNull: false,
  },
  image: {
      type: DataTypes.STRING,
      allowNull: true,
  }
});

module.exports = Product;
