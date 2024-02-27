const response = require('../response');

const postValidation = (req, key) => {
  const passwordValidated = require('./validationPassword');
  const dateValidated = require('./validationDate');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { body } = req;

  const keyUpdate = key.map((item) => {
    const split = item.includes(':') ? item.split(':') : [item];

    return {
      key: split[0],
      type: split[1] || 'string',
      length: split[2] || null,

    };
  });

  const filteredArray = keyUpdate.map((item) => {
    const lengthSplit = item.length !== null ? item.length.split("|") : []
    const findMin = lengthSplit.find((lengthValue) => lengthValue.includes("min"))?.split('min') || [];
    const findMax = lengthSplit.find((lengthValue) => lengthValue.includes("max"))?.split('max') || [];
    const findLength = lengthSplit.find((lengthValue) => lengthValue.includes("length"))?.split('length') || [];
    // console.log(findMin);
    return {
      key: item.key,
      value: body[item.key],
      type: item.type,
      min: !!findMin[1] ? findMin[1] : null,
      max: !!findMax[1] ? findMax[1] : null,
      length: !!findLength[1] ? findLength[1] : null,
    }
  });


  const validated = filteredArray.map((item) => {
    // console.log(item.max);
    if (item.value === undefined) {
      return response.responseLocal({
        status: 400,
        message: `Required ${item.key} is missing in the request body`,
      });
    } else if ((item.type === 'string' || item.type === 'email' || item.type === 'password' || item.type === 'date') && item.value === '') {
      return response.responseLocal({
        status: 400,
        message: `Field ${item.key} cannot be empty`,
      });
    } else if (item.type === 'number' && typeof item.value !== 'number') {
      return response.responseLocal({
        status: 400,
        message: `Field ${item.key} must be number`,
      });
    } else if (item.type === 'email' && !emailRegex.test(item.value)) {
      return response.responseLocal({
        status: 400,
        message: `Field ${item.key} not valid`,
      });
    } else if (item.type === 'password' && passwordValidated(item.value) !== false) {
      return passwordValidated(item.value);
    } else if (item.length !== null && item.value.length != item.length) {
      return response.responseLocal({
        status: 400,
        message: `Invalid ${item.key} length, length must be ${item.length}`,
      });
    } else if (item.max !== null && item.value.length >= item.max) {
      return response.responseLocal({
        status: 400,
        message: `Invalid ${item.key} length, length must be <= ${item.max}`,
      });
    } else if (item.min !== null && item.value.length <= item.min) {
      return response.responseLocal({
        status: 400,
        message: `Invalid ${item.key} length, length must be >= ${item.min}`,
      });
    }

    return true;
  });

  return validated.find((item) => item !== true)
};

module.exports = {
  postValidation,
};
