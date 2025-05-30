module.exports = (sequelize, DataTypes) => {
  const PantryItem = sequelize.define('PantryItem', {
    pantryItemId: {
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
    foodItemMasterId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FoodItemMaster',
        key: 'masterItemId'
      }
    },
    customItemName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        customNameValidator(value) {
          if (!this.foodItemMasterId && !value) {
            throw new Error('Custom item name is required when no master item is selected');
          }
        }
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
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    storageLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FoodCategories',
        key: 'categoryId'
      }
    }
  }, {
    tableName: 'pantry_items',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PantryItem.associate = (models) => {
    PantryItem.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    PantryItem.belongsTo(models.FamilyGroup, {
      foreignKey: 'familyGroupId',
      as: 'familyGroup'
    });

    PantryItem.belongsTo(models.FoodItemMaster, {
      foreignKey: 'foodItemMasterId',
      as: 'foodItem'
    });

    PantryItem.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit'
    });

    PantryItem.belongsTo(models.FoodCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return PantryItem;
};