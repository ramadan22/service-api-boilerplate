const defaultModel = require('../../../models/users');
const validation = require('../../../utils/validation');
const response = require('../../../utils/response');
const uuid = require('../../../lib/uuid');
const filterObject = require('../../../utils/converter/filterObject');
const bcrypt = require('../../../lib/bcrypt');

const serviceName = 'users';

const useGet = async (req, res) => {
  try {
    const { keyword, page, size, order_by, order_name } = req.query;

    const offset = (Number(page || 1) - 1) * Number(size || 10);

    const { dataRows: data, meta } = await defaultModel.getData({
      keyword: !!keyword ? keyword : '',
      offset: !!page ? offset : 0,
      limit: size || 10,
      order_by: !!order_by ? order_by : 'DESC',
      order_name: !!order_name ? order_name : 'created_at',
    });

    const mapped = data.map((item) => {
      return {
        ...filterObject.filter(
          { ...item, },
          [],
        ),
      };
    });

    response.defaultResponse({
      res,
      status: 200,
      message: `Success get ${serviceName}`,
      data: mapped,
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

const useCreate = async (req, res) => {
  const { body } = req;

  const validationKey = [
    'first_name:string',
    'last_name:string',
    'gender:number',
    'birth_date:date',
    'email:email',
    'password:password'
  ];

  const validated = validation.postValidation(req, validationKey);

  if (validated) {
    return res.status(validated.status).json(validated);
  }

  try {
    const [checkEmail] = await defaultModel.getDataByEmail(body.email);

    if (checkEmail.length > 0) {
      response.defaultResponse({ res, status: 409, message: 'Email already exists.' });
      return;
    }

    const payload = {
      ...body,
      id_user: uuid.generateId(),
      password: await bcrypt.encryptPassword(body.password),
      is_delete: 0,
    };

    await defaultModel.createData(payload);

    const payloadResponse = {
      ...filterObject.filter(payload, ['id_sub_district', 'password', 'is_delete']),
      gender: payload.gender === 1 ? 'Male' : 'Female',
    };

    response.defaultResponse({ res, status: 201, message: `Success create ${serviceName}`, data: payloadResponse });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useUpdate = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const validationKey = [
    'first_name:string',
    'last_name:string',
    'gender:number',
    'birth_date:date',
  ];

  const validated = validation.postValidation(req, validationKey);

  if (validated) {
    return res.status(validated.status).json(validated)
  }

  try {
    await defaultModel.updateData(body, id);
    response.defaultResponse({
      res,
      status: 200,
      message: `Success update ${serviceName}`,
      data: {
        id_user: id,
        ...body
      },
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useDelete = async (req, res) => {
  const { id } = req.params;

  try {
    await defaultModel.deleteData(id);
    response.defaultResponse({ res, status: 200, message: `Success delete ${serviceName}` });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

module.exports = {
  useGet,
  useCreate,
  useUpdate,
  useDelete,
}