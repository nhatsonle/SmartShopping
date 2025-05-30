module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    unitId: {
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
        len: [1, 30]
      }
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 10]
      }
    },
    type: {
      type: DataTypes.ENUM('weight', 'volume', 'count'),
      allowNull: false
    }
  }, {
    tableName: 'units',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Unit.associate = (models) => {
    Unit.hasMany(models.FoodItemMaster, {
      foreignKey: 'defaultUnitId',
      as: 'foodItems'
    });

    Unit.hasMany(models.PantryItem, {
      foreignKey: 'unitId',
      as: 'pantryItems'
    });

    Unit.hasMany(models.ShoppingListItem, {
      foreignKey: 'unitId',
      as: 'shoppingListItems'
    });

    Unit.hasMany(models.RecipeIngredient, {
      foreignKey: 'unitId',
      as: 'recipeIngredients'
    });
  };

  return Unit;
}; 