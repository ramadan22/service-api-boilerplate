const UserModel = require('../../../models/users');
const ResponseUtils = require('../../../utils/response');
const ValidationUtils = require('../../../utils/validation');
// const SubDistrictsModel = require('../../../models/sub-districts');
const FilterObjectUtils = require('../../../utils/converter/filterObject');
// const ConvertLocationUtils = require('../../../utils/converter/convertLocation');

const updateProfile = async (req, res) => {
  try {
    const { body, user } = req;

    const id_user = user.id_user;

    const validationKey = [
      'first_name:string',
      'last_name:string',
      'address:string',
      'gender:number',
      'id_sub_district:number',
      'birth_date:date',
    ];

    const validated = ValidationUtils.postValidation(req, validationKey);

    if (validated) {
      return res.status(validated.status).json(validated)
    }

    await UserModel.updateData(body, id_user);

    // const [getDetailLocation] = await SubDistrictsModel.getDataDetail(body.id_sub_district);

    const payloadResponse = {
      ...FilterObjectUtils.filter(body, ['id_sub_district']),
      gender: body.gender === 1 ? 'Male' : 'Female',
      // location: ConvertLocationUtils.location(getDetailLocation[0]),
    };

    ResponseUtils.defaultResponse({
      res,
      status: 200,
      message: 'Success update profile',
      data: payloadResponse,
    });
  } catch (error) {
    ResponseUtils.responseErrorServer(res, error);
  }
};

module.exports = updateProfile;
