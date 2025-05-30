module.exports = (sequelize, DataTypes) => {
  const MealPlanEntry = sequelize.define('MealPlanEntry', {
    entryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    mealPlanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'MealPlans',
        key: 'mealPlanId'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    mealType: {
      type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Recipes',
        key: 'recipeId'
      }
    },
    customDishName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        customNameValidator(value) {
          if (!this.recipeId && !value) {
            throw new Error('Custom dish name is required when no recipe is selected');
          }
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'meal_plan_entries',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  MealPlanEntry.associate = (models) => {
    MealPlanEntry.belongsTo(models.MealPlan, {
      foreignKey: 'mealPlanId',
      as: 'mealPlan'
    });

    MealPlanEntry.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
  };

  return MealPlanEntry;
}; 