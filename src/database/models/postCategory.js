'use strict';
const PostCategory = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {
    postId: {
        type: DataTypes.INTEGER, 
        foreignKey: true 
    },
    categoryId: { 
        type: DataTypes.INTEGER, 
        foreignKey: true 
    },
},
{
  timestamps: false,
  tableName: 'PostCategories',
});

  PostCategory.associate = (models) => {
    models.Category.belongsToMany(models.BlogPost, {
      as: 'blogPosts',
      through: PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });

    models.BlogPost.belongsToMany(models.Category, {
      as: 'categories',
      through: PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId'
    });
  }

  return PostCategory;
};

module.exports = PostCategory;