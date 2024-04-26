'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id_user: '1d990163-b2c0-4a8a-9469-46ff3efd5d9e',
        first_name: 'Super',
        last_name: 'Admin',
        gender: 1,
        birth_date: '2024-01-16',
        email: 'super_admin@gmail.com',
        phone: '081514433282',
        password: '$2b$10$NDeIqTBhxuf/f8n5CqXxluiz42/mrBmGqfemZg4b/KUEOk936dUba',
        is_delete: false
      },
      {
        id_user: '1d990163-b2c0-4a8a-9469-46ff3efd5d9f',
        first_name: 'Haris',
        last_name: 'Ramadan',
        gender: 1,
        birth_date: '1997-12-30',
        email: 'harisramadan@gmail.com',
        phone: '081514433282',
        password: '$2b$10$NDeIqTBhxuf/f8n5CqXxluiz42/mrBmGqfemZg4b/KUEOk936dUba',
        is_delete: false
      },
      {
        id_user: '1d990163-b2c0-4a8a-9469-46ff3efd5d9g',
        first_name: 'Danang',
        last_name: 'Suprianto',
        gender: 1,
        birth_date: '1998-05-20',
        email: 'danangsupriantor@gmail.com',
        phone: '081514433282',
        password: '$2b$10$NDeIqTBhxuf/f8n5CqXxluiz42/mrBmGqfemZg4b/KUEOk936dUba',
        is_delete: false
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
