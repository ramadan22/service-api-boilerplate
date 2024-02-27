const response = require('../../../utils/response');
const uuid = require('../../../lib/uuid');
const schoolAdministratorModel = require('../../../models/school_administrator');

const useAssignAdmin = async (req, res) => {
  try {
    const { id_user, id_school } = req.body

    const check = await schoolAdministratorModel.checkIfExist({ id_user });

    if (check.exist > 0) {
      response.defaultResponse({ res, status: 409, message: 'School Administrator already exists.' });
      return;
    }

    await schoolAdministratorModel.createData({
      id_school_administrator: uuid.generateId(),
      id_user,
      id_school,
    });

    response.defaultResponse({
      res,
      status: 200,
      message: `Success assign admin`,
      // data: getSchools?.data,
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
};

module.exports = useAssignAdmin;
