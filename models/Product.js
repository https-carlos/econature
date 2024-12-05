const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Compra = require('./Compra'); // Importando corretamente o modelo Compra
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Certifique-se de que o modelo 'Compra' é importado corretamente e então a associação é feita
Product.belongsToMany(Compra, { through: 'CompraProduct' });
Compra.belongsToMany(Product, { through: 'CompraProduct' });

module.exports = Product;
