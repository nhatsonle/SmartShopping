module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    notificationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    familyGroupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FamilyGroups',
        key: 'groupId'
      }
    },
    type: {
      type: DataTypes.ENUM('expiry_warning', 'low_stock', 'new_shopping_list_item', 'meal_plan_reminder', 'system_announcement'),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    relatedEntityType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    createdAt: 'created_at'
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Notification.belongsTo(models.FamilyGroup, {
      foreignKey: 'familyGroupId',
      as: 'familyGroup'
    });
  };

  return Notification;
}; 