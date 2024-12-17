// Importa o tipo de dados do Sequelize
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize configurada no projeto
const sequelize = require('../Config/database');

// Importa o modelo "Compra" para estabelecer relações entre modelos
const Compra = require('./Compra');

// Define o modelo "Product" utilizando o Sequelize
// Este modelo representa a tabela "Product" no banco de dados
const Product = sequelize.define('Product', {
  // Define o campo "name" como uma string obrigatória
  name: {
    type: DataTypes.STRING,
    allowNull: false, // O campo não pode ser nulo
  },
  // Define o campo "description" como uma string obrigatória
  description: {
    type: DataTypes.STRING,
    allowNull: false, // O campo não pode ser nulo
  },
  // Define o campo "price" como um número de ponto flutuante obrigatório
  price: {
    type: DataTypes.FLOAT,
    allowNull: false, // O campo não pode ser nulo
  },
  // Define o campo "category" como uma string obrigatória
  category: {
    type: DataTypes.STRING,
    allowNull: false, // O campo não pode ser nulo
  },
  // Define o campo "image" como uma string opcional
  image: {
    type: DataTypes.STRING,
    allowNull: true, // O campo pode ser nulo
  }
});

// Estabelece a relação de muitos-para-muitos entre "Product" e "Compra"
// Utiliza uma tabela intermediária chamada "CompraProduct"
Product.belongsToMany(Compra, { through: 'CompraProduct' });
Compra.belongsToMany(Product, { through: 'CompraProduct' });

// Exporta o modelo "Product" para ser utilizado em outras partes do sistema
module.exports = Product;
