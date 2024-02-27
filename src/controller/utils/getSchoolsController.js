const SchoolsModel = require('../../models/schools');
const response = require('../../utils/response');
const filterObject = require('../../utils/converter/filterObject');

const getSchoolsController = async (req, res) => {
  try {
    const { keyword, page, size, order_by, order_name } = req.query;
    const offset = (Number(page || 1) - 1) * Number(size || 10);
    const { dataRows: data, meta } = await SchoolsModel.getData({
      keyword: !!keyword ? keyword : '',
      offset: !!page ? offset : 0,
      limit: size || 10,
      order_by: !!order_by ? order_by : 'DESC',
      order_name: !!order_name ? order_name : 'created_at',
    });

    const mapped = data.map((item) => {
      const {
        id_sub_district,
        name_sub_district,
        id_district,
        name_district,
        id_regency,
        name_regency,
        id_province,
        name_province,
        ...rest
      } = item;
      return {
        ...rest,
        location: {
          id_sub_district,
          name_sub_district,
          id_district,
          name_district,
          id_regency,
          name_regency,
          id_province,
          name_province,
        }
      };
    });

    const payloadResponse = filterObject.filter(mapped, ['is_delete']);

    return {
      data: payloadResponse,
      meta: {
        ...meta,
        page: Number(page || 1),
        size: Number(size || 10),
      },
    };
  } catch (error) {
    response.responseErrorServer(res, error);
  }
}

module.exports = getSchoolsController