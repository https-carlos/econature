// Importa o módulo 'DataTypes' do Sequelize, que é usado para definir os tipos de dados das colunas no banco de dados.
const { DataTypes } = require('sequelize');

// Importa a instância configurada do Sequelize a partir do arquivo 'database'.
// Essa instância é responsável por gerenciar a conexão com o banco de dados.
const sequelize = require('../Config/database');

// Define o modelo 'Compra' usando a instância do Sequelize.
// Um modelo representa uma tabela no banco de dados.
const Compra = sequelize.define('Compra', {
  // Define o campo 'status', que armazena o status da compra.
  // Tipo de dado: STRING (texto)
  // allowNull: false indica que este campo é obrigatório (não pode ser nulo).
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Define o campo 'total', que armazena o valor total da compra.
  // Tipo de dado: FLOAT (números com casas decimais)
  // allowNull: false indica que este campo é obrigatório (não pode ser nulo).
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  // Define o campo 'quantidade', que armazena a quantidade de itens na compra.
  // Tipo de dado: INTEGER (número inteiro)
  // allowNull: false indica que este campo é obrigatório (não pode ser nulo).
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Exporta o modelo 'Compra' para que ele possa ser utilizado em outras partes do projeto.
// Por exemplo, este modelo pode ser usado para criar, ler, atualizar ou excluir registros da tabela 'Compra' no banco de dados.
module.exports = Compra;
