module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      } 
    },

  });

  Comment.associate = models => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });

    Comment.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false
      }
    });
  };


  return Comment;
}