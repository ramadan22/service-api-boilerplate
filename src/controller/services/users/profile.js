const UserModel = require('../../../models/users');
const ResponseUtils = require('../../../utils/response');
const SubDistrictsModel = require('../../../models/sub-districts');
const FilterObjectUtils = require('../../../utils/converter/filterObject');
const ConvertLocationUtils = require('../../../utils/converter/convertLocation');

const useGetProfile = async (req, res) => {
  const auth = req.user;

  try {
    const [result] = await UserModel.getDataDetail(auth.id_user);

    const data = result[0];

    const [getDetailLocation] = await SubDistrictsModel.getDataDetail(data.id_sub_district);

    const payloadResponse = {
      ...FilterObjectUtils.filter(data, ['id_sub_district']),
      gender: data.gender === 1 ? 'Male' : 'Female',
      location: ConvertLocationUtils.location(getDetailLocation[0]),
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

module.exports = useGetProfile;
