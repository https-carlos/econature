// Importa o módulo DataTypes do Sequelize para definir os tipos de dados das colunas.
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize configurada para conexão com o banco de dados.
const sequelize = require('../Config/database');

// Importa os modelos Cart (Carrinho) e Product (Produto) para estabelecer as relações.
const Cart = require('./Cart');
const Product = require('./Product');

// Define o modelo CartItem, que representa a tabela intermediária "Cart_Item" no banco de dados.
const CartItem = sequelize.define('CartItem', {
  // Define a coluna "cart_id" que será uma chave estrangeira referenciando o modelo Cart.
  cart_id: {
    type: DataTypes.INTEGER, // Tipo inteiro.
    references: {
      model: Cart, // Modelo referenciado.
      key: 'id',  // Coluna no modelo Cart que será referenciada.
    },
  },
  // Define a coluna "product_id" que será uma chave estrangeira referenciando o modelo Product.
  product_id: {
    type: DataTypes.INTEGER, // Tipo inteiro.
    references: {
      model: Product, // Modelo referenciado.
      key: 'id',  // Coluna no modelo Product que será referenciada.
    },
  },
  // Define a coluna "quantity" para armazenar a quantidade de produtos no carrinho.
  quantity: {
    type: DataTypes.INTEGER, // Tipo inteiro.
    allowNull: false, // Não permite valores nulos.
    defaultValue: 1, // Valor padrão será 1.
  }
}, {
  timestamps: false, // Desabilita as colunas de timestamp (createdAt e updatedAt).
  tableName: 'Cart_Item', // Define o nome da tabela no banco de dados.
});

// Estabelece a relação muitos-para-muitos entre Cart e Product através da tabela CartItem.
Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cart_id' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'product_id' });

// Exporta o modelo CartItem para ser utilizado em outras partes do projeto.
module.exports = CartItem;
