const express = require('express');
const jwt = require('../../../lib/jwt');
// const response = require('../../../utils/response');
// const AuthUserHasRole = require('../../../helpers/AuthUserHasRole');

const ProfileUserController = require('../../../controller/services/users/profile');
const UpdateProfileController = require('../../../controller/services/users/updateProfile');

const router = express.Router();

// READ - GET
router.get('/profile', jwt.verifyToken, ProfileUserController);
router.put('/update-profile', jwt.verifyToken, UpdateProfileController);

module.exports = router;