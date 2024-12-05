// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Compra = require('./Compra');

class User extends Model {}

User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'User',
});

User.hasMany(Compra, { foreignKey: 'user_id' });
Compra.belongsTo(User, { foreignKey: 'user_id' });

module.exports = User;
