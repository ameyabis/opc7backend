'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql::memory");

const Message = sequelize.define("message", {
  idUSERS: DataTypes.INTEGER,
  title: DataTypes.STRING,
  content: DataTypes.STRING,
  attachment: DataTypes.STRING,
  likes: DataTypes.INTEGER
});

(async () => {
  await sequelize.sync({force:true});
})();