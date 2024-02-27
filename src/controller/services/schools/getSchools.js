const response = require('../../../utils/response');
const getSchoolsController = require('../../utils/getSchoolsController');

const useGetSchools = async (req, res) => {
  try {
    const getSchools = await getSchoolsController(req, res);

    response.defaultResponse({
      res,
      status: 200,
      message: `Success get list school`,
      data: getSchools?.data,
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
};

module.exports = useGetSchools;
