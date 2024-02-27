const response = require('../../../utils/response');
const uuid = require('../../../lib/uuid');
const validation = require('../../../utils/validation');
const UserHasRoleModel = require('../../../models/user_has_role');

const getUserHasRoles = async (req, res) => {
  const { keyword, page, size, order_by, order_name } = req.query;

  const offset = (Number(page || 1) - 1) * Number(size || 10);

  try {
    const { dataRows: data, meta } = await UserHasRoleModel.getUsersHasRole({
      keyword: !!keyword ? keyword : '',
      offset: !!page ? offset : 0,
      limit: size || 10,
      order_by: !!order_by ? order_by : 'DESC',
      order_name: !!order_name ? order_name : 'created_at',
    });

    response.defaultResponse({
      res,
      status: 200,
      message: 'Success get data management roles',
      data,
      meta: {
        ...meta,
        page: Number(page || 1),
        size: Number(size || 10),
      },
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const getUserHasRoleList = async (req, res) => {
  const { id } = req.params;

  try {
    const [data] = await UserHasRoleModel.getDataByUserId(id);

    response.defaultResponse({
      res,
      status: 200,
      message: 'Success get data role list',
      data
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const assignRole = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const user = req.user;
  const resultCheckUserRole = [];
  const createAssignRole = [];

  const unValidate = body?.map((item) => {
    const validationKey = ['id_role:string'];
    const validated = validation.postValidation({ body: item }, validationKey);

    if (validated) {
      return {
        status: validated.status,
        response: validated,
      };
    }

    return false;
  });

  const findUnValidate = unValidate.find((item) => item !== false);

  if (findUnValidate) {
    return res.status(findUnValidate.status).json(findUnValidate.response);
  }

  try {
    const promiseArray = body?.map(async (item) => {
      const query = UserHasRoleModel.getDataDetail(id);
      return query;
    });

    const resultQuery = await Promise.all(promiseArray);

    resultQuery.forEach((result) => {
      resultCheckUserRole.push(result[0]);
    });

    body.forEach((item) => {
      const find = resultCheckUserRole[0]?.find((item2) => item2.id_role === item.id_role);

      if (!find) {
        const query = UserHasRoleModel.postUserHasRole({
          ...item,
          id_user_has_role: uuid.generateId(),
          id_user: id,
        });

        createAssignRole.push(query);
      }
    });

    await Promise.all(createAssignRole);

    await resultCheckUserRole[0]?.map(async (item, index) => {

      const find = body.find((item2) => item2.id_role === item.id_role);

      const query = await UserHasRoleModel.postUserHasRoleUnAssign(item.id_user_has_role, find ? 0 : 1);
      return query;
    });

    response.defaultResponse({
      res,
      status: 200,
      message: 'Success assign data role'
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const unAssignRole = async (req, res) => {
  const body = req.body;
  const resultCheckUserRole = [];

  const unValidate = body.map((item) => {
    const validationKey = ['id_role:string'];
    const validated = validation.postValidation({ body: item }, validationKey);

    if (validated) {
      return {
        status: validated.status,
        response: validated,
      };
    }

    return false;
  });

  const findUnValidate = unValidate.find((item) => item !== false);

  if (findUnValidate) {
    return res.status(findUnValidate.status).json(findUnValidate.response);
  }

  try {
    const promiseArray = body?.map(async (item) => {
      const query = UserHasRoleModel.getDataDetail(item.id_role, id);
      return query;
    });

    const resultQuery = await Promise.all(promiseArray);

    resultQuery.forEach((result, index) => {
      resultCheckUserRole.push(result[0][0]);
    });

    const promiseArrayPost = resultCheckUserRole.map((item, index) => {
      const find = body[index].id_role === item?.id_role ? item : null;

      if (find) {
        const query = UserHasRoleModel.postUserHasRoleUnAssign(find.id_user_has_role);

        return query;
      }
    });

    await Promise.all(promiseArrayPost);

    response.defaultResponse({
      res,
      status: 200,
      message: 'Success un assign role'
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

module.exports = {
  assignRole,
  unAssignRole,
  getUserHasRoles,
  getUserHasRoleList,
};
