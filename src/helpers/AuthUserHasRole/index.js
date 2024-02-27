// const response = require('../../../utils/response');
const userHasRoleModel = require('../../models/user_has_role');
const response = require('../../utils/response');

const checkAuthUserHasRole = async (req, res, roles) => {
  const { user } = req;

  try {
    const [getUserHasRole] = await userHasRoleModel.getDataDetail(user.id_user);

    const find = !!getUserHasRole.find((item) => roles.includes(item.slug));
    const findAccessAll = !!roles?.find((item) => item === 'ALL');

    if (findAccessAll) return true;

    if (!find) response.defaultResponse({ res, status: 401, message: 'Sorry you do not have access' });

    return find;
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

module.exports = {
  checkAuthUserHasRole,
}
