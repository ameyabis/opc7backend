'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    usersLike: DataTypes.STRING,
    usersDislike: DataTypes.STRING
  },
    {});
  Post.associate = function (models) {
    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'cascade'
    });
  };
  return Post;
};