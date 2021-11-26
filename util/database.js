require('dotenv').config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.nameBDD, process.env.userBDD, process.env.passwordBDD, { host: process.env.hostBDD, dialect: process.env.dialectBDD});

module.exports = sequelize;