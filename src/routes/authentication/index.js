const express = require('express');

const signIn = require('../../controller/authentication/signIn');

const router = express.Router();

router.post('/signIn', signIn);

module.exports = router;