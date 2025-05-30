module.exports = (sequelize, DataTypes) => {
  const FoodItemMaster = sequelize.define('FoodItemMaster', {
    masterItemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    defaultCategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FoodCategories',
        key: 'categoryId'
      }
    },
    defaultUnitId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Units',
        key: 'unitId'
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    storageTips: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'food_item_master',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  FoodItemMaster.associate = (models) => {
    FoodItemMaster.belongsTo(models.FoodCategory, {
      foreignKey: 'defaultCategoryId',
      as: 'category'
    });

    FoodItemMaster.belongsTo(models.Unit, {
      foreignKey: 'defaultUnitId',
      as: 'unit'
    });

    FoodItemMaster.hasMany(models.PantryItem, {
      foreignKey: 'foodItemMasterId',
      as: 'pantryItems'
    });

    FoodItemMaster.hasMany(models.ShoppingListItem, {
      foreignKey: 'foodItemMasterId',
      as: 'shoppingListItems'
    });

    FoodItemMaster.hasMany(models.RecipeIngredient, {
      foreignKey: 'foodItemMasterId',
      as: 'recipeIngredients'
    });
  };

  return FoodItemMaster;
}; 