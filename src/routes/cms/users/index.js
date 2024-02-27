const express = require('express');
const jwt = require('../../../lib/jwt');
const response = require('../../../utils/response');
const PermissionUser = require('../../../helpers/PermissionUser');

const UserController = require('../../../controller/cms/users');

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
router.post('/', jwt.verifyToken, authCheck, UserController.useCreate);

// READ - GET
router.get('/', jwt.verifyToken, authCheck, UserController.useGet);

// UPDATE - PUT
router.put('/:id', jwt.verifyToken, authCheck, UserController.useUpdate);

// DELETE - DELETE
router.delete('/:id', jwt.verifyToken, authCheck, UserController.useDelete);

module.exports = router;