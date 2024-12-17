// Importando o módulo DataTypes do Sequelize para definir os tipos de dados das colunas
econst { DataTypes } = require('sequelize');

// Importando a instância do Sequelize configurada
const sequelize = require('../Config/database');

// Importando o modelo de usuário (User) para criar a associação com o carrinho (Cart)
const User = require('./user');

// Definindo o modelo "Cart" (Carrinho) utilizando o Sequelize
const Cart = sequelize.define('Cart', {
  // Definindo o campo "user_id" que será uma chave estrangeira referenciando o modelo User
  user_id: {
    type: DataTypes.INTEGER, // Tipo de dado: número inteiro
    references: {
      model: User, // Define o modelo ao qual a chave estrangeira se refere (User)
      key: 'id',  // Define o campo do modelo User ao qual o campo "user_id" faz referência
    },
  },
}, {
  timestamps: true, // Habilita os campos "createdAt" e "updatedAt" para o modelo Cart
});

// Estabelecendo o relacionamento 1-para-1 entre User e Cart
User.hasOne(Cart, { foreignKey: 'user_id' }); // Um usuário tem um único carrinho
Cart.belongsTo(User, { foreignKey: 'user_id' }); // O carrinho pertence a um único usuário

// Exportando o modelo Cart para que ele possa ser usado em outras partes da aplicação
module.exports = Cart;
