const dbPool = require('../../config/database');
const sqlString = require('../../utils/converter/sqlString');

const tableName = 'users';
const primaryKey = 'id_user';
const fields = [
  'id_user',
  'first_name',
  'last_name',
  'birth_date',
  'email',
  'gender',
  'password',
  'phone',
];

const getData = async ({ keyword, offset, limit, order_by, order_name }) => {
  const includeFields = [
    'created_at',
    'updated_at',
  ];

  const excludeFields = ['password', 'is_delete'];

  const selectFields = sqlString.convertSelectField({ fields, includeFields, excludeFields });

  const SQLQuery = `
    SELECT
      ${selectFields},
      CASE
        WHEN gender = 1 THEN 'Male'
        WHEN gender = 0 THEN 'Female'
      END AS gender
    FROM
      ${tableName}
    WHERE is_delete = 0
      AND (
        users.first_name LIKE ? OR
        users.last_name LIKE ?
      )
    ORDER BY users.${order_name} ${order_by}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM ${tableName} WHERE is_delete = 0
      AND (
        users.first_name LIKE ? OR
        users.last_name LIKE ?
      );
  `;

  const searchKeyword = `%${keyword}%`;

  const [dataResults, countResult] = await Promise.all([
    dbPool.execute(SQLQuery, [searchKeyword, searchKeyword, limit, offset]),
    dbPool.execute(countQuery, [searchKeyword, searchKeyword]),
  ]);

  const [dataRows] = dataResults;
  const [{ total }] = countResult[0];

  return {
    dataRows,
    meta: {
      total,
    },
  };
};

const createData = (body) => {
  const includeFields = ['is_delete'];

  const createFields = sqlString.convertCreateField({ fields, includeFields });
  const values = sqlString.convertCreateFieldValue({ fields, includeFields, body });

  const SQLQuery = `INSERT INTO ${tableName} ${createFields} VALUES ${values}`;

  return dbPool.execute(SQLQuery);
}

const createDataWithFileExel = (body) => {
  const includeFields = ['is_delete', 'username'];
  const excludeFields = ['address', 'email', 'phone'];

  const createFields = sqlString.convertCreateField({ fields, includeFields, excludeFields });
  const values = sqlString.convertCreateFieldValue({ fields, includeFields, excludeFields, body });

  const SQLQuery = `INSERT INTO ${tableName} ${createFields} VALUES ${values}`;

  return dbPool.execute(SQLQuery);
}

const updateData = (body, id) => {
  const includeFields = [];
  const excludeFields = ['id_user', 'email', 'password'];

  const values = sqlString.convertUpdateFieldValue({ fields, excludeFields, includeFields, body });
  const SQLQuery = `UPDATE ${tableName} SET ${values} WHERE ${primaryKey} = ?`;

  return dbPool.execute(SQLQuery, [id]);
}

const deleteData = (id) => {
  const SQLQuery = `UPDATE ${tableName} SET is_delete='1' WHERE ${primaryKey}='${id}'`;

  return dbPool.execute(SQLQuery);
}

const getDataDetail = (id) => {
  const includeFields = ['id_sub_district', 'created_at', 'updated_at'];
  const excludeFields = ['password', 'is_delete'];

  const selectFields = sqlString.convertSelectField({ fields, includeFields, excludeFields });

  const SQLQuery = `SELECT ${selectFields} FROM ${tableName} WHERE id_user = ?`;

  return dbPool.execute(SQLQuery, [id]);
}

const getDataByEmail = (email) => {
  const SQLQuery = `SELECT * FROM ${tableName} WHERE is_delete = 0 AND email = ?`;

  return dbPool.execute(SQLQuery, [email]);
}

// UHSC is user_has_student_classroom
const getDataByEmailJoinUHSC = (email) => {
  const SQLQuery = `
    SELECT
      *
    FROM
      ${tableName}
    JOIN
      user_has_student_classroom AS uhsc ON uhsc.id_user = users.id_user
    WHERE
      users.email = ?
  `;

  return dbPool.execute(SQLQuery, [email]);
}

const getDataSignIn = ({ email }) => {
  const SQLQuery = `
    SELECT
      *
    FROM
      ${tableName}
    WHERE
      email = ?
  `;

  return dbPool.execute(SQLQuery, [email]);
}

const getDataSignInByUsername = ({ username }) => {
  const SQLQuery = `
    SELECT
      *
    FROM
      ${tableName}
    WHERE
      username = ?
  `;

  return dbPool.execute(SQLQuery, [username]);
}

const getTotalUsers = async () => {
  const countQuery = `
    SELECT COUNT(*) AS total FROM ${tableName} WHERE is_delete = 0
  `;

  const [countResult] = await Promise.all([
    dbPool.execute(countQuery),
  ]);
  const [{ total }] = countResult[0];

  return total
}

module.exports = {
  getData,
  createData,
  updateData,
  deleteData,
  getDataByEmail,
  getDataDetail,
  getDataSignIn,
  getTotalUsers,
  createDataWithFileExel,
  getDataByEmailJoinUHSC,
  getDataSignInByUsername,
}