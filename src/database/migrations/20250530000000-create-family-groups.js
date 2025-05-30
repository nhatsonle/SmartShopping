'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('family_groups', {
      group_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_by_user_id: {
        type: Sequelize.UUID,
        allowNull: true // Set to true initially, will be updated after user creation
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    // Add foreign key constraint after both tables exist
    await queryInterface.addConstraint('family_groups', {
      fields: ['created_by_user_id'],
      type: 'foreign key',
      name: 'fk_family_group_creator',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('family_groups', 'fk_family_group_creator');
    await queryInterface.dropTable('family_groups');
  }
}; 