const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('homemaker', 'family_member', 'admin'),
      defaultValue: 'homemaker'
    },
    familyGroupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'FamilyGroups',
        key: 'groupId'
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  User.associate = (models) => {
    User.belongsTo(models.FamilyGroup, {
      foreignKey: 'familyGroupId',
      as: 'familyGroup'
    });

    User.hasMany(models.ShoppingList, {
      foreignKey: 'ownerUserId',
      as: 'ownedShoppingLists'
    });

    User.hasMany(models.PantryItem, {
      foreignKey: 'userId',
      as: 'pantryItems'
    });

    User.hasMany(models.Recipe, {
      foreignKey: 'createdByUserId',
      as: 'createdRecipes'
    });

    User.belongsToMany(models.Recipe, {
      through: 'UserFavoriteRecipe',
      foreignKey: 'userId',
      otherKey: 'recipeId',
      as: 'favoriteRecipes'
    });
  };

  return User;
}; 