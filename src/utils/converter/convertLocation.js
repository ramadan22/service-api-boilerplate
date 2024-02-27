const location = (arrayLocation) => {
  return {
    province: {
      id: arrayLocation?.id_province || '',
      name: arrayLocation?.name_province || '',
    },
    regency: {
      id: arrayLocation?.id_regency || '',
      name: arrayLocation?.name_regency || '',
    },
    district: {
      id: arrayLocation?.id_district || '',
      name: arrayLocation?.name_district || '',
    },
    sub_district: {
      id: arrayLocation?.id_sub_district || '',
      name: arrayLocation?.name_sub_district || '',
    },
  };
};

module.exports = {
  location,
};
