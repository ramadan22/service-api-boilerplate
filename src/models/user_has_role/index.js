const dbPool = require('../../config/database');

const getUsersHasRole = async ({ keyword, offset, limit, order_by, order_name }) => {
  const SQLQuery = `
    SELECT
      id_user,
      first_name,
      last_name,
      email,
      created_at,
      updated_at,
      (
        SELECT
          GROUP_CONCAT(roles.name)
        FROM
          user_has_role ur
        JOIN
          roles ON roles.id_role = ur.id_role
        WHERE ur.id_user = users.id_user
          AND ur.is_delete = 0
      ) AS roles
    FROM
      users
    WHERE is_delete = 0
      AND (
        first_name LIKE ? OR
        last_name LIKE ? OR
        email LIKE ? OR
        id_user LIKE ?
      )
    ORDER BY ${order_name} ${order_by}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM users WHERE is_delete = 0
      AND (
        first_name LIKE ? OR
        last_name LIKE ? OR
        email LIKE ? OR
        id_user LIKE ?
      );
  `;

  const searchKeyword = `%${keyword}%`;

  // return dbPool.execute(SQLQuery, [searchKeyword, searchKeyword, searchKeyword, searchKeyword, limit, offset]);

  const [dataResults, countResult] = await Promise.all([
    dbPool.execute(SQLQuery, [searchKeyword, searchKeyword, searchKeyword, searchKeyword, limit, offset]),
    dbPool.execute(countQuery, [searchKeyword, searchKeyword, searchKeyword, searchKeyword,]),
  ]);

  const [dataRows] = dataResults;
  const [{ total }] = countResult[0];

  return {
    dataRows,
    meta: {
      total,
    },
  };
}

const getDataDetail = async (id_user) => {
  const SQLQuery = `
    SELECT
      *
    FROM
      user_has_role
    JOIN
      roles ON roles.id_role = user_has_role.id_role
    WHERE
      user_has_role.id_user = ?
      AND user_has_role.is_delete = 0
  `;

  return dbPool.execute(SQLQuery, [id_user]);
};

const getDataByUserId = (id) => {
  const SQLQuery = `
    SELECT
      roles.slug as slug,
      user_has_role.id_user_has_role as id_user_has_role,
      roles.id_role as id_role,
      users.id_user as id_user
    FROM
      user_has_role
    JOIN
      users ON users.id_user = user_has_role.id_user
    JOIN
      roles ON roles.id_role = user_has_role.id_role
    WHERE
      users.id_user = ?
      AND user_has_role.is_delete = 0
  `;

  return dbPool.execute(SQLQuery, [id]);
};

const postUserHasRole = (payload) => {
  const SQLQuery = `
    INSERT INTO
      user_has_role
        (id_user_has_role, id_role, id_user, is_delete)
    VALUES
      ('${payload.id_user_has_role}', '${payload.id_role}', '${payload.id_user}', '0')
  `;

  return dbPool.execute(SQLQuery);
}

const postUserHasRoleUnAssign = (id_user_has_role, is_delete = 1) => {
  const SQLQuery = `UPDATE user_has_role SET is_delete = ${is_delete} WHERE id_user_has_role = ?`;

  return dbPool.execute(SQLQuery, [id_user_has_role]);
}

module.exports = {
  getDataDetail,
  getUsersHasRole,
  getDataByUserId,
  postUserHasRole,
  postUserHasRoleUnAssign,
};
