// Importa o módulo 'DataTypes' do Sequelize para definir os tipos de dados usados nos modelos.
const { DataTypes } = require('sequelize');

// Importa a configuração do banco de dados (conexão estabelecida com Sequelize).
const sequelize = require('../Config/database');

// Importa o modelo de Produto.
const Product = require('./Product');

// Importa o modelo de Doenças.
const Diseases = require('./Diseases');

// Define o modelo intermediário 'ProductDisease' para estabelecer o relacionamento N:N (muitos para muitos)
// entre os modelos 'Product' e 'Diseases'. Este modelo não possui colunas além das geradas automaticamente.
const ProductDisease = sequelize.define('ProductDisease', {}, {
    // Desativa a criação automática dos campos 'createdAt' e 'updatedAt' (timestamps).
    timestamps: false
});

// Define o relacionamento N:N de 'Product' com 'Diseases', usando o modelo intermediário 'ProductDisease'.
// O relacionamento utiliza o alias 'doencas', permitindo que os dados de doenças relacionadas
// a um produto sejam acessados através de 'Product.doencas'.
Product.belongsToMany(Diseases, { through: ProductDisease, as: 'doencas' });

// Define o relacionamento N:N de 'Diseases' com 'Product', usando o modelo intermediário 'ProductDisease'.
// O relacionamento utiliza o alias 'produtos', permitindo que os dados de produtos relacionados
// a uma doença sejam acessados através de 'Diseases.produtos'.
Diseases.belongsToMany(Product, { through: ProductDisease, as: 'produtos' });

// Exporta o modelo 'ProductDisease' para ser utilizado em outras partes do sistema.
module.exports = ProductDisease;
