const express = require('express');
const { ensureRole } = require('../middleware/auth');
const ctrl = require('../controllers/adminUsersController');

const router = express.Router();

router.get('/', ensureRole('admin'), ctrl.index);
router.post('/:id/suspend', ensureRole('admin'), ctrl.suspend);
router.post('/:id/activate', ensureRole('admin'), ctrl.activate);
router.post('/:id/delete', ensureRole('admin'), ctrl.remove);

module.exports = { router };