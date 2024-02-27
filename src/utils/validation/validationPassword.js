const response = require('../response');

const passwordValidated = (password) => {
  if (password.length < 8) {
    return response.responseLocal({
      status: 400,
      message: 'The minimum password length is 8 digits',
    });
  };

  // Have at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return response.responseLocal({
      status: 400,
      message: 'The password must have at least one uppercase letter',
    });
  }

  // Have at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return response.responseLocal({
      status: 400,
      message: 'The password must have at least one special character',
    });
  }

  // Have at least one number
  if (!/\d/.test(password)) {
    return response.responseLocal({
      status: 400,
      message: 'The password must have at least one number',
    });
  }

  // If all conditions are met, the password is valid
  return false;
};

module.exports = passwordValidated;
