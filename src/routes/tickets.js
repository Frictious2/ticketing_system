const express = require('express');
const { ensureAuthenticated, ensureRole, ensureAnyRole, ensureTicketOwner } = require('../middleware/auth');
const ctrl = require('../controllers/ticketController');

const router = express.Router();

router.get('/', ensureAuthenticated, ctrl.list);
router.get('/new', ensureAuthenticated, ctrl.getCreate);
router.post('/', ensureAuthenticated, ctrl.postCreate);
router.get('/:id', ensureAuthenticated, ctrl.show);
router.get('/:id/edit', ensureAuthenticated, ensureTicketOwner, ctrl.getEdit);
router.post('/:id', ensureAuthenticated, ensureTicketOwner, ctrl.postEdit);
router.post('/:id/delete', ensureRole('admin'), ctrl.postDelete);
router.post('/:id/comments', ensureAuthenticated, ctrl.postComment);
router.post('/:id/attachments', ensureAuthenticated, ctrl.uploadAttachment, ctrl.postAttachment);
router.post('/:id/assign', ensureRole('admin'), ctrl.postAssign);
router.post('/:id/in-progress', ensureAnyRole(['admin', 'technician']), ctrl.postInProgress);
router.post('/:id/resolve', ensureAnyRole(['admin', 'technician']), ctrl.postResolve);

module.exports = { router };