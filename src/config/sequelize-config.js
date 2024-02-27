// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
// const database = process.env.DB_NAME;
// const host = process.env.DB_HOST;
// const dialect = 'mysql';

module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'service_api_boilerplate',
    host: 'localhost',
    dialect: 'mysql',
  },
  production: {
    // Konfigurasi produksi jika diperlukan
  },
};
