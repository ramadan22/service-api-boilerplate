const dbPool = require('../../config/database');
const sqlString = require('../../utils/converter/sqlString');

const tableName = 'roles';
const primaryKey = 'id_role';
const fields = ['id_role', 'name', 'slug'];

const getData = () => {
  const includeFields = ['created_at', 'updated_at'];
  const excludeFields = ['is_delete'];

  const selectFields = sqlString.convertSelectField({ fields, includeFields, excludeFields });

  const SQLQuery = `
    SELECT
      ${selectFields}
    FROM
      ${tableName}
    WHERE is_delete=0
    ORDER BY created_at ASC
  `;

  return dbPool.execute(SQLQuery);
}

const createData = (body) => {
  const includeFields = ['is_delete'];

  const createFields = sqlString.convertCreateField({ fields, includeFields });
  const values = sqlString.convertCreateFieldValue({ fields, includeFields, body });

  const SQLQuery = `INSERT INTO ${tableName} ${createFields} VALUES ${values}`;

  return dbPool.execute(SQLQuery);
}

const updateData = (body, id) => {
  const excludeFields = ['id_role'];

  const values = sqlString.convertUpdateFieldValue({ fields, excludeFields, body });
  const SQLQuery = `UPDATE ${tableName} SET ${values} WHERE ${primaryKey} = ?`;

  return dbPool.execute(SQLQuery, [id]);
}

const deleteData = (id) => {
  const SQLQuery = `UPDATE ${tableName} SET is_delete='1' WHERE ${primaryKey}='${id}'`;

  return dbPool.execute(SQLQuery);
}

module.exports = {
  getData,
  createData,
  updateData,
  deleteData,
}