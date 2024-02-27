const bcrypt = require('bcrypt');
const saltRounds = 10;

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, passwordFromDb) => {
  try {
    const result = await bcrypt.compare(password, passwordFromDb);;

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  encryptPassword,
  comparePassword,
};