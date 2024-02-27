const express = require('express');
const jwt = require('../../../lib/jwt');
const response = require('../../../utils/response');
const PermissionUser = require('../../../helpers/PermissionUser');

const RolesController = require('../../../controller/cms/roles');

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

// CREATE - POST
router.post('/', jwt.verifyToken, authCheck, RolesController.useCreate);

// READ - GET
router.get('/', jwt.verifyToken, authCheck, RolesController.useGet);

// UPDATE - PUT
router.put('/:id', jwt.verifyToken, authCheck, RolesController.useUpdate);

// DELETE - DELETE
router.delete('/:id', jwt.verifyToken, authCheck, RolesController.useDelete);

module.exports = router;