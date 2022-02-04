'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      reference: {
        model: 'User',
        key: 'id'
      }
    }
  }, {});
  Like.associate = function (models) {
    
    models.User.belongsToMany(models.Post, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'postId',
    });
    models.Post.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'postId',
      otherKey: 'userId',
    });
    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    models.Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
    });
  };
  return Like;
};