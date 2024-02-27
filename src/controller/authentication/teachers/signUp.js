const uuid = require('../../../lib/uuid');
const usersModel = require('../../../models/users');
const teachersModel = require('../../../models/teachers');
const response = require('../../../utils/response');
const validation = require('../../../utils/validation');
const bcrypt = require('../../../lib/bcrypt');
const filterObject = require('../../../utils/converter/filterObject');
const subDistrictsModel = require('../../../models/sub-districts');
const convertLocation = require('../../../utils/converter/convertLocation');

const useRegister = async (req, res) => {
  const { body } = req;

  const validationKey = [
    'first_name:string',
    'last_name:string',
    'email:email',
    'password:password',
    'birth_date:date',
    'id_sub_district:number',
    'address:string',
    'phone:string',
    'nuptk:string:length8',
  ];

  const validated = validation.postValidation(req, validationKey);

  if (validated) {
    return res.status(validated.status).json(validated)
  }

  try {
    const [checkEmail] = await usersModel.getDataByEmail(body.email);

    if (checkEmail.length > 0) {
      response.defaultResponse({ res, status: 409, message: 'Email already exists.' });
      return;
    }

    const id_user = uuid.generateId();
    const id_teacher = uuid.generateId();

    const payloadCreateUser = {
      id_user,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await bcrypt.encryptPassword(body.password),
      birth_date: body.birth_date,
      gender: body.gender,
      id_sub_district: body.id_sub_district,
      address: body.address,
      phone: body.phone,
      is_delete: 0,
    };

    const payloadCreateTeacher = {
      id_user,
      id_teacher,
      nuptk: body.nuptk,
      is_delete: 0,
    };

    await usersModel.createData(payloadCreateUser);
    await teachersModel.createData(payloadCreateTeacher);

    const [getDetailLocation] = await subDistrictsModel.getDataDetail(payloadCreateUser.id_sub_district);

    const payloadResponse = filterObject.filter({
      ...filterObject.filter({ ...payloadCreateUser }, ['id_sub_district', 'password']),
      ...filterObject.filter({ ...payloadCreateTeacher }, []),
      location: convertLocation.location(getDetailLocation[0]),
    }, ['is_delete']);

    response.defaultResponse({ res, status: 200, message: 'Success signup teacher', data: payloadResponse });
  } catch (error) {
    response.responseErrorServer(res, error);
  }
};

module.exports = useRegister;