const express = require('express');
const router = express.Router();

const userCtrl = require('../constrollers/users');
const bruteForce = require('../middleware/brute-force');

router.post('/signup', userCtrl.signup);
router.post('/login', bruteForce, userCtrl.login);

module.exports = router;