'use strict';
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql::memory");

const User = sequelize.define("user", {
    email: DataTypes.STRING,
    surname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
});

(async () => {
  await sequelize.sync({force:true});
})();