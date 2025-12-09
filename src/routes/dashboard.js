const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const { index } = require('../controllers/dashboardController');

const router = express.Router();
router.get('/', ensureAuthenticated, index);
module.exports = { router };

