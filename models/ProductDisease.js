const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Product = require('./Product');
const Diseases = require('./Diseases');

const ProductDisease = sequelize.define('ProductDisease', {}, {
    timestamps: false
});

// Usando alias 'doencas' para o relacionamento de Product
Product.belongsToMany(Diseases, { through: ProductDisease, as: 'doencas' });

// Usando alias 'produtos' para o relacionamento de Diseases
Diseases.belongsToMany(Product, { through: ProductDisease, as: 'produtos' });

module.exports = ProductDisease;
