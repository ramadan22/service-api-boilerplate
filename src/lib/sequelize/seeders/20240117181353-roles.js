'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id_role: 'fcb8c2b6-a41c-4f62-906d-fab0ea84994e',
        name: 'Super Admin',
        slug: 'SUPER_ADMIN',
        is_delete: false
      },
      {
        id_role: '5f1dc6e2-9e67-466b-a1d0-c5991e7b53c3',
        name: 'Admin',
        slug: 'ADMIN',
        is_delete: false
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
