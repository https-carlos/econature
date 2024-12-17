// Config/database.js

// Importando a classe Sequelize da biblioteca 'sequelize' para gerenciar a comunicação com o banco de dados
const { Sequelize } = require('sequelize');

// Carregando variáveis de ambiente a partir de um arquivo .env para manter as credenciais e configurações em segurança
require('dotenv').config();

// Criando uma instância do Sequelize, passando as informações de configuração para se conectar ao banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nome do banco de dados, obtido das variáveis de ambiente
  process.env.DB_USER,     // Usuário do banco de dados, obtido das variáveis de ambiente
  process.env.DB_PASS,     // Senha do banco de dados, obtida das variáveis de ambiente
  {
    host: process.env.DB_HOST, // Endereço do host do banco de dados, obtido das variáveis de ambiente
    port: process.env.DB_PORT, // Porta do banco de dados, obtida das variáveis de ambiente
    dialect: 'mysql',          // Tipo do banco de dados (neste caso, MySQL)
    dialectOptions: {
      ssl: {                   // Configuração de SSL para segurança da conexão com o banco de dados
        require: true,         // Exige que a conexão utilize SSL
        rejectUnauthorized: false // Permite conexões com certificados não autorizados (útil para testes)
      }
    }
  }
);

// Exportando a instância do Sequelize para ser usada em outras partes do sistema
module.exports = sequelize;
