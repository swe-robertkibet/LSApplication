const sequelize = require('../config/database');
const Customer = require('./customer');
const Project = require('./project');

Customer.hasMany(Project);
Project.belongsTo(Customer);

module.exports = {
    sequelize,
    Customer,
    Project,
};