const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./user');

const Cart = sequelize.define('Cart', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Cart;
