const { Sequelize } = require('sequelize');
const { host, database, user, password } = require('../../config/databaseConfig');
const User = require('../models/User');
const Url = require('../models/URL'); // Updated import name to 'Url'

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',
});
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const models = {
  User: User.init(sequelize, Sequelize),
  Url: Url.init(sequelize,Sequelize), // Updated model name to 'Url'
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});
module.exports = { sequelize };
