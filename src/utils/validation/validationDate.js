const response = require('../response');
const dateFns = require('../../lib/date-fns');

const dateValidated = (dateString) => {
  const parsedDate = new Date(dateString);
  if (dateFns.isValid(parsedDate) && dateFns.format(parsedDate, 'yyyy-MM-dd') === dateString) {
    return response.responseLocal({
      status: 400,
      message: 'The minimum password length is 8 digits',
    });
  }

  return false;
};

module.exports = dateValidated;
