const response = require('../../../utils/response');
const studentModel = require('../../../models/students');
const subDistrictsModel = require('../../../models/sub-districts');
const convertLocation = require('../../../utils/converter/convertLocation');
const filterObject = require('../../../utils/converter/filterObject');
const PermissionUserHelpers = require('../../../helpers/PermissionUser');

const useGetProfile = async (req, res) => {
  try {
    const permissionStudent = await PermissionUserHelpers.GetSpesificPermission({
      slug: 'STUDENT',
      permission: req.user.permission,
    });

    const id_student = permissionStudent.student_data.id_student;

    const [result] = await studentModel.getDetail(id_student);

    const [getDetailLocation] = await subDistrictsModel.getDataDetail(result[0].id_sub_district);

    response.defaultResponse({
      res,
      status: 200,
      message: 'Success get detail profile student',
      data: {
        ...filterObject.filter({ ...result[0] }, ['id_sub_district']),
        location: convertLocation.location(getDetailLocation[0]),
      }
    });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
};

module.exports = useGetProfile;
