const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./user');
const Diseases = require('./Diseases');

const UserDisease = sequelize.define('UserDiseases', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  disease_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Diseases,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'User_Disease',
});

User.belongsToMany(Diseases, { through: UserDisease, foreignKey: 'user_id' });
Diseases.belongsToMany(User, { through: UserDisease, foreignKey: 'disease_id' });

module.exports = UserDisease;
