const userHasRoleModel = require('../../models/user_has_role');

const GetPermissionUser = async (id_user) => {
  const [getUserHasRole] = await userHasRoleModel.getDataDetail(id_user);

  const permission = [];

  if (getUserHasRole?.length > 0) {
    getUserHasRole.forEach((item) => {
      const createObject = {};
      createObject[item.slug] = true;

      permission.push({
        permission_role: item.slug
      });
    })
  }

  return permission;
}

const CheckPermissionUser = ({ res, permission, access }) => {
  const isAuth = permission.filter((item) => access.includes(item.permission_role)).length > 0;

  if (!isAuth) {
    return { res, status: 401, message: 'Sorry you do not have access' };
  }

  return null;
}

const GetSpesificPermission = ({ slug, permission }) => {
  return permission.find((item) => item.permission_role === slug);
}

module.exports = {
  GetPermissionUser,
  CheckPermissionUser,
  GetSpesificPermission,
};
