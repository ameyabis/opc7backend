const express = require('express');
const router = express.Router();

const userCtrl = require('../constrollers/users');
const bruteForce = require('../middleware/brute-force');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/login/:id', userCtrl.getOneLogin);
router.get('/login', userCtrl.getLogin);
router.put('/login/:id', userCtrl.updateLogin);
router.delete('/login/:id', userCtrl.deleteLogin);

module.exports = router;