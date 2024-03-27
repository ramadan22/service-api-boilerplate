require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    host: "database-mysql",
    port: process.env.MYSQL_DOCKER_PORT,
    // port: process.env.DB_PORT,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    host: "database-mysql",
    port: process.env.MYSQL_DOCKER_PORT,
    // port: process.env.DB_PORT,
    dialect: 'mysql',
  },
};
