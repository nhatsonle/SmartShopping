module.exports = (sequelize, DataTypes) => {
  const ShoppingList = sequelize.define('ShoppingList', {
    listId: {
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
    familyGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'FamilyGroups',
        key: 'groupId'
      }
    },
    ownerUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    type: {
      type: DataTypes.ENUM('daily', 'weekly', 'adhoc'),
      defaultValue: 'adhoc'
    },
    creationDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'archived'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'shopping_lists',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ShoppingList.associate = (models) => {
    ShoppingList.belongsTo(models.FamilyGroup, {
      foreignKey: 'familyGroupId',
      as: 'familyGroup'
    });

    ShoppingList.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });

    ShoppingList.hasMany(models.ShoppingListItem, {
      foreignKey: 'listId',
      as: 'items'
    });
  };

  return ShoppingList;
}; 