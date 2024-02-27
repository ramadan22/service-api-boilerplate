'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_has_role', {
      id_user_has_role: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      id_role: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE(6),
        defaultValue: Sequelize.literal('NULL ON UPDATE CURRENT_TIMESTAMP(6)'),
        allowNull: true,
      },
      is_delete: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
    }, {
      timestamps: true,
      underscored: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_has_role');
  },
};
