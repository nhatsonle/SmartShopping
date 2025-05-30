module.exports = (sequelize, DataTypes) => {
  const ShoppingListItem = sequelize.define('ShoppingListItem', {
    itemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    listId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ShoppingLists',
        key: 'listId'
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FoodCategories',
        key: 'categoryId'
      }
    },
    desiredQuantity: {
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
    isPurchased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    purchasedByUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    purchasedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderInList: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'shopping_list_items',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ShoppingListItem.associate = (models) => {
    ShoppingListItem.belongsTo(models.ShoppingList, {
      foreignKey: 'listId',
      as: 'shoppingList'
    });

    ShoppingListItem.belongsTo(models.FoodItemMaster, {
      foreignKey: 'foodItemMasterId',
      as: 'foodItem'
    });

    ShoppingListItem.belongsTo(models.FoodCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    ShoppingListItem.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit'
    });

    ShoppingListItem.belongsTo(models.User, {
      foreignKey: 'purchasedByUserId',
      as: 'purchasedBy'
    });
  };

  return ShoppingListItem;
}; 