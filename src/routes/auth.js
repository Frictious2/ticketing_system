const express = require('express');
const { getLogin, postLogin, getRegister, postRegister, postLogout } = require('../controllers/authController');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', ensureRole('admin'), getRegister);
router.post('/register', ensureRole('admin'), postRegister);
router.post('/logout', ensureAuthenticated, postLogout);

module.exports = { router };
