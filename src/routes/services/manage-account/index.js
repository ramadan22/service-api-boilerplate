const express = require('express');
const jwt = require('../../../lib/jwt');
const response = require('../../../utils/response');
const PermissionUser = require('../../../helpers/PermissionUser');

const assignSchoolAdministrator = require('../../../controller/services/manage-account/assignSchoolAdministrator');

const router = express.Router();

const authCheck = async (req, res, next) => {
  try {
    const { user } = req;

    const responseErrorAuth = PermissionUser.CheckPermissionUser({
      res,
      permission: user?.permission,
      access: ['SUPER_ADMIN']
    });

    if (!!responseErrorAuth) {
      response.defaultResponse({ res, ...responseErrorAuth });
    } else {
      next();
    }
  } catch (error) {
    response.responseErrorServer(res, error);
  }
};

// // READ - GET
router.post('/assign-school-administrator', jwt.verifyToken, authCheck, assignSchoolAdministrator);

module.exports = router;