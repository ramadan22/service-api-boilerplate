const provincesModel = require('../../../models/provinces');
const regenciesModel = require('../../../models/regencies');
const districtsModel = require('../../../models/districts');
const subDistrictsModel = require('../../../models/sub-districts');
const response = require('../../../utils/response');

const useGetProvinces = async (_, res) => {
  try {
    const [data] = await provincesModel.getData();

    response.defaultResponse({ res, status: 200, message: 'Success get provinces', data });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useGetRegencies = async (req, res) => {
  const { id } = req.params;

  if (id === '') {
    response.defaultResponse({ res, status: 400, message: 'Required id_province is missing in the request params' });
  }

  try {
    const [data] = await regenciesModel.getData(id);

    response.defaultResponse({ res, status: 200, message: 'Success get regencies', data });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useGetDistricts = async (req, res) => {
  const { id } = req.params;

  if (id === '') {
    response.defaultResponse({ res, status: 400, message: 'Required id_regency is missing in the request params' });
  }

  try {
    const [data] = await districtsModel.getData(id);

    response.defaultResponse({ res, status: 200, message: 'Success get districts', data });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

const useGetSubDistricts = async (req, res) => {
  const { id } = req.params;

  if (id === '') {
    response.defaultResponse({ res, status: 400, message: 'Required id_districts is missing in the request params' });
  }

  try {
    const [data] = await subDistrictsModel.getData(id);

    response.defaultResponse({ res, status: 200, message: 'Success get sub districts', data });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

module.exports = {
  useGetProvinces,
  useGetRegencies,
  useGetDistricts,
  useGetSubDistricts,
}