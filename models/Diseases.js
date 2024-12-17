// Importa o módulo DataTypes do Sequelize, que é utilizado para definir os tipos de dados das colunas de um modelo.
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize configurada a partir do arquivo de configuração.
const sequelize = require('../Config/database'); 

// Define um modelo chamado "Diseases" para representar a tabela no banco de dados.
const Diseases = sequelize.define('Diseases', {
  // Define o atributo "name" como uma coluna da tabela.
  name: {
    type: DataTypes.STRING, // Especifica que o tipo de dado é uma string (texto).
    allowNull: false, // Garante que esse campo não pode ser nulo, ou seja, é obrigatório.
    unique: true, // Garante que os valores dessa coluna sejam únicos no banco de dados.
  },
}, {
  timestamps: false, // Desativa a criação automática das colunas "createdAt" e "updatedAt".
});

// Exporta o modelo "Diseases" para que possa ser utilizado em outros arquivos do projeto.
module.exports = Diseases;
