// models/User.js

// Importa as classes Model e DataTypes do Sequelize, que serão usadas para definir o modelo User.
const { Model, DataTypes } = require('sequelize');

// Importa a configuração do banco de dados para conectar o modelo à instância do Sequelize.
const sequelize = require('../Config/database');

// Importa o modelo Compra, pois há uma associação entre User e Compra.
const Compra = require('./Compra');

// Define a classe User, que estende a classe Model do Sequelize.
class User extends Model {}

// Inicializa o modelo User com seus atributos e configurações.
User.init({
    // Define o atributo 'name' como uma string.
    name: DataTypes.STRING,
    // Define o atributo 'email' como uma string.
    email: DataTypes.STRING,
    // Define o atributo 'password' como uma string (devemos aplicar hashing ao salvar senhas).
    password: DataTypes.STRING,
}, {
    // Conecta o modelo à instância do Sequelize definida anteriormente.
    sequelize,
    // Define o nome do modelo como 'User', que também é usado como referência interna pelo Sequelize.
    modelName: 'User',
});

// Define o relacionamento "um para muitos" (hasMany) entre User e Compra.
// Um usuário pode ter várias compras, associadas pela chave estrangeira 'user_id'.
User.hasMany(Compra, { foreignKey: 'user_id' });

// Define o relacionamento "pertence a" (belongsTo) entre Compra e User.
// Cada compra pertence a um único usuário, identificado pela chave estrangeira 'user_id'.
Compra.belongsTo(User, { foreignKey: 'user_id' });

// Exporta o modelo User para que ele possa ser usado em outras partes do projeto.
module.exports = User;
