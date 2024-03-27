const mysql = require('mysql2');

const dbPool = mysql.createPool({
  host: "database-mysql",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});

module.exports = dbPool.promise();