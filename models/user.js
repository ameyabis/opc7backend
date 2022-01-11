'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Post = require('../models/post')

const User = sequelize.define("user", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  email: { allowNull: false, type: Sequelize.STRING },

  surname: { allowNull: false, type: Sequelize.STRING },

  firstname: { allowNull: false, type: Sequelize.STRING },

  password: { allowNull: false, type: Sequelize.STRING },

  isAdmin: { allowNull: false, type: Sequelize.BOOLEAN },

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

User.hasMany(Post,{as:'posts',foreignKey:'userId'})


module.exports = User;