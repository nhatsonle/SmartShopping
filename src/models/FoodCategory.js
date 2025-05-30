module.exports = (sequelize, DataTypes) => {
  const FoodCategory = sequelize.define('FoodCategory', {
    categoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'food_categories',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  FoodCategory.associate = (models) => {
    FoodCategory.hasMany(models.FoodItemMaster, {
      foreignKey: 'defaultCategoryId',
      as: 'foodItems'
    });

    FoodCategory.hasMany(models.PantryItem, {
      foreignKey: 'categoryId',
      as: 'pantryItems'
    });

    FoodCategory.hasMany(models.ShoppingListItem, {
      foreignKey: 'categoryId',
      as: 'shoppingListItems'
    });
  };

  return FoodCategory;
}; 