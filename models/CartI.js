const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Cart = require('./Cart');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
  cart_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cart,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  }
}, {
  timestamps: false,
  tableName: 'Cart_Item',
});

Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cart_id' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'product_id' });

module.exports = CartItem;
