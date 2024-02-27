const defaultModel = require('../../../models/roles');
const validation = require('../../../utils/validation');
const response = require('../../../utils/response');
const uuid = require('../../../lib/uuid');
const filterObject = require('../../../utils/converter/filterObject');

const serviceName = 'roles';

const useGet = async (_, res) => {
  try {
    const [data] = await defaultModel.getData();

    response.defaultResponse({ res, status: 200, message: `Success get ${serviceName}`, data });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useCreate = async (req, res) => {
  const { body } = req;

  const validationKey = ['name:string', 'slug:string'];
  const validated = validation.postValidation(req, validationKey);

  if (validated) {
    return res.status(validated.status).json(validated)
  }

  try {
    const payload = {
      ...body,
      id_role: uuid.generateId(),
      is_delete: 0,
    };

    await defaultModel.createData(payload);

    const payloadResponse = filterObject.filter(payload, ['is_delete']);
    response.defaultResponse({ res, status: 201, message: `Success create ${serviceName}`, data: payloadResponse });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useUpdate = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const validationKey = ['name:string', 'slug:string'];
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
        id_role: id,
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