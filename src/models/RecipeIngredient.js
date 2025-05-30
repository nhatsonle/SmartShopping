module.exports = (sequelize, DataTypes) => {
  const RecipeIngredient = sequelize.define('RecipeIngredient', {
    recipeIngredientId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'recipeId'
      }
    },
    foodItemMasterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'FoodItemMaster',
        key: 'masterItemId'
      }
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Units',
        key: 'unitId'
      }
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'recipe_ingredients',
    timestamps: false
  });

  RecipeIngredient.associate = (models) => {
    RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });

    RecipeIngredient.belongsTo(models.FoodItemMaster, {
      foreignKey: 'foodItemMasterId',
      as: 'ingredient'
    });

    RecipeIngredient.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit'
    });
  };

  return RecipeIngredient;
}; 