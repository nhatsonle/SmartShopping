module.exports = (sequelize, DataTypes) => {
  const FamilyGroup = sequelize.define('FamilyGroup', {
    groupId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    createdByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      }
    }
  }, {
    tableName: 'family_groups',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  FamilyGroup.associate = (models) => {
    FamilyGroup.hasMany(models.User, {
      foreignKey: 'familyGroupId',
      as: 'members'
    });

    FamilyGroup.belongsTo(models.User, {
      foreignKey: 'createdByUserId',
      as: 'creator'
    });

    FamilyGroup.hasMany(models.ShoppingList, {
      foreignKey: 'familyGroupId',
      as: 'shoppingLists'
    });

    FamilyGroup.hasMany(models.PantryItem, {
      foreignKey: 'familyGroupId',
      as: 'pantryItems'
    });

    FamilyGroup.hasMany(models.MealPlan, {
      foreignKey: 'familyGroupId',
      as: 'mealPlans'
    });
  };

  return FamilyGroup;
}; 