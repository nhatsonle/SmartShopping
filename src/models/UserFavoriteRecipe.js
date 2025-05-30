module.exports = (sequelize, DataTypes) => {
  const UserFavoriteRecipe = sequelize.define('UserFavoriteRecipe', {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    recipeId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'recipeId'
      }
    }
  }, {
    tableName: 'user_favorite_recipes',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    createdAt: 'created_at'
  });

  return UserFavoriteRecipe;
}; 