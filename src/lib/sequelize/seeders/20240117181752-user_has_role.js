'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_has_role', [
      {
        id_user_has_role: '27ceaade-982c-4e46-8a5e-86a05edcad56',
        id_role: '5f1dc6e2-9e67-466b-a1d0-c5991e7b53c3',
        id_user: '1d990163-b2c0-4a8a-9469-46ff3efd5d9e',
        is_delete: false
      },
      {
        id_user_has_role: 'f318b80c-9829-11ee-9ba6-02c1250a7600',
        id_role: 'fcb8c2b6-a41c-4f62-906d-fab0ea84994e',
        id_user: '1d990163-b2c0-4a8a-9469-46ff3efd5d9e',
        is_delete: false
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_has_role', null, {});
  }
};
