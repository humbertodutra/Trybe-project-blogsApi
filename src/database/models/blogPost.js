'use strict';
const BlogPost = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: {type: DataTypes.INTEGER, foreignKey: true },
    published: {
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      field: 'published'
    },
    updated: {
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      field: 'updated'
    }
  }, {
    createdAt: 'published',
    updatedAt: 'updated',
    tableName: 'BlogPosts'
  })

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      foreingKey: 'userId', as: 'user'
    });

  }

  return BlogPost;
}

module.exports = BlogPost;