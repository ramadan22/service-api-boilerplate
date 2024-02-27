'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id_user: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      gender: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      // address: {
      //   type: DataTypes.TEXT,
      //   defaultValue: null,
      //   allowNull: true,
      // },
      // id_sub_district: {
      //   type: DataTypes.BIGINT,
      //   defaultValue: null,
      //   allowNull: true,
      // },
      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(225),
        defaultValue: null,
        allowNull: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(225),
        defaultValue: null,
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(14),
        defaultValue: null,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(225),
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
    await queryInterface.dropTable('users');
  },
};
