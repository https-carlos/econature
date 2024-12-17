// Importa o módulo DataTypes do Sequelize, usado para definir os tipos de dados das colunas no banco de dados
const { DataTypes } = require('sequelize');

// Importa a instância de conexão com o banco de dados configurada no arquivo Config/database.js
const sequelize = require('../Config/database');

// Importa o modelo de Usuário, que representa a tabela "User" no banco de dados
const User = require('./user');

// Importa o modelo de Doenças, que representa a tabela "Diseases" no banco de dados
const Diseases = require('./Diseases');

// Define o modelo "UserDiseases" para representar a tabela intermediária que conecta usuários e doenças
const UserDisease = sequelize.define('UserDiseases', {
  // Define a coluna "user_id" que faz referência ao ID de um usuário na tabela "User"
  user_id: {
    type: DataTypes.INTEGER, // Define o tipo de dado como inteiro
    references: {
      model: User, // Faz referência ao modelo "User"
      key: 'id',   // Utiliza a coluna "id" do modelo "User"
    },
  },
  // Define a coluna "disease_id" que faz referência ao ID de uma doença na tabela "Diseases"
  disease_id: {
    type: DataTypes.INTEGER, // Define o tipo de dado como inteiro
    references: {
      model: Diseases, // Faz referência ao modelo "Diseases"
      key: 'id',       // Utiliza a coluna "id" do modelo "Diseases"
    },
  },
}, {
  timestamps: false,       // Desativa as colunas automáticas "createdAt" e "updatedAt"
  tableName: 'User_Disease', // Especifica o nome da tabela no banco de dados
});

// Configura o relacionamento muitos-para-muitos entre usuários e doenças usando a tabela intermediária "UserDisease"
User.belongsToMany(Diseases, { through: UserDisease, foreignKey: 'user_id' });

// Configura o relacionamento muitos-para-muitos entre doenças e usuários usando a tabela intermediária "UserDisease"
Diseases.belongsToMany(User, { through: UserDisease, foreignKey: 'disease_id' });

// Exporta o modelo "UserDisease" para ser utilizado em outras partes do sistema
module.exports = UserDisease;
