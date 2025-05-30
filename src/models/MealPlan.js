module.exports = (sequelize, DataTypes) => {
  const MealPlan = sequelize.define('MealPlan', {
    mealPlanId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    familyGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'FamilyGroups',
        key: 'groupId'
      }
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Weekly Meal Plan'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM('daily', 'weekly'),
      defaultValue: 'weekly'
    }
  }, {
    tableName: 'meal_plans',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  MealPlan.associate = (models) => {
    MealPlan.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    MealPlan.belongsTo(models.FamilyGroup, {
      foreignKey: 'familyGroupId',
      as: 'familyGroup'
    });

    MealPlan.hasMany(models.MealPlanEntry, {
      foreignKey: 'mealPlanId',
      as: 'entries'
    });
  };

  return MealPlan;
}; 