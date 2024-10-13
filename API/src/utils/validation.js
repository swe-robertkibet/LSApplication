const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lsapplication', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;