const express = require('express');
const jwt = require('../../../lib/jwt');
const response = require('../../../utils/response');
const PermissionUser = require('../../../helpers/PermissionUser');

const ManagementRoles = require('../../../controller/cms/management-roles');

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
// router.post('/', jwt.verifyToken, authCheck, RolesController.useCreate);

// READ - GET
router.get('/', jwt.verifyToken, authCheck, ManagementRoles.getUserHasRoles);

// READ - GET
router.get('/user-has-role/:id', jwt.verifyToken, authCheck, ManagementRoles.getUserHasRoleList);

// ASSIGN ROLE
router.post('/user-has-role/:id', jwt.verifyToken, authCheck, ManagementRoles.assignRole);

// UNASSIGN ROLE
router.post('/user-has-role/unassign', jwt.verifyToken, authCheck, ManagementRoles.unAssignRole);


module.exports = router;