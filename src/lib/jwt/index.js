const jwt = require('jsonwebtoken');
const response = require('../../utils/response');
const PermissionUser = require('../../helpers/PermissionUser');

const signToken = (payload) => {
  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, options);
};

const verifyToken = async (req, res, next) => {
  const secretKey = process.env.ACCESS_TOKEN_KEY;
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    response.defaultResponse({ res, status: 401, message: 'Token not found' });
    return;
  }

  const token = authorizationHeader
    .replace(/bearer/gi, '')
    .replace(/ /g, '');

  try {
    const decoded = jwt.verify(token, secretKey);

    const permission = await PermissionUser.GetPermissionUser(decoded?.id_user);

    req.user = {
      ...decoded,
      permission,
    };

    next();
  } catch (error) {
    response.defaultResponse({ res, status: 401, message: error.message });
  }
}

module.exports = {
  signToken,
  verifyToken,
};
