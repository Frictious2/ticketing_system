const multer = require('multer');
const path = require('path');
const { listTickets, createTicket, getTicket, updateTicket, deleteTicket, assignTicket, resolveTicket } = require('../models/ticketModel');
const { addComment, listComments } = require('../models/commentModel');
const { addAttachment, listAttachments } = require('../models/attachmentModel');
const { pool } = require('../config/db');
const { sendTicketAssignedEmail, sendTicketResolvedEmail } = require('../config/mailer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

function list(req, res) {
  listTickets().then(tickets => res.render('tickets/list', { tickets }));
}

async function getCreate(req, res) {
  const [technicians] = await pool.query('SELECT id, name FROM users WHERE role = ?', ['technician']);
  res.render('tickets/create', { technicians });
}

async function postCreate(req, res) {
  if (!req.body.title || !req.body.description || !req.body.priority || !req.body.issue_type) {
    req.flash('error', 'All fields are required');
    return res.redirect('/tickets/new');
  }
  if (!['low','medium','high','critical'].includes(req.body.priority) || !['hardware','software','network','other'].includes(req.body.issue_type)) {
    req.flash('error', 'Invalid values');
    return res.redirect('/tickets/new');
  }
  const assigneeId = req.user.role === 'admin' && req.body.assignee_id ? Number(req.body.assignee_id) : null;
  const ticket = await createTicket({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    issue_type: req.body.issue_type,
    creator_id: req.user.id,
    assignee_id: assigneeId
  });
  if (assigneeId) {
    const [[technician], [creator]] = await Promise.all([
      pool.query('SELECT id, name, email FROM users WHERE id = ?', [assigneeId]).then(([r]) => r),
      pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]).then(([r]) => r)
    ]);
    await sendTicketAssignedEmail({ id: ticket.id, title: ticket.title }, technician, creator);
  }
  req.flash('success', 'Ticket created');
  res.redirect(`/tickets/${ticket.id}`);
}

async function show(req, res) {
  const id = req.params.id;
  const ticket = await getTicket(id);
  if (!ticket) return res.redirect('/tickets');
  const comments = await listComments(id);
  const attachments = await listAttachments(id);
  res.render('tickets/show', { ticket, comments, attachments });
}

async function getEdit(req, res) {
  const ticket = await getTicket(req.params.id);
  if (!ticket) return res.redirect('/tickets');
  req.flash('error', 'Editing disabled');
  res.redirect(`/tickets/${ticket.id}`);
}

async function postEdit(req, res) {
  const id = req.params.id;
  req.flash('error', 'Editing disabled');
  res.redirect(`/tickets/${id}`);
}

async function postDelete(req, res) {
  const id = req.params.id;
  await deleteTicket(id);
  req.flash('success', 'Ticket deleted');
  res.redirect('/tickets');
}

async function postComment(req, res) {
  const id = req.params.id;
  if (!req.body.content) {
    req.flash('error', 'Content required');
    return res.redirect(`/tickets/${id}`);
  }
  await addComment(id, req.user.id, req.body.content);
  req.flash('success', 'Comment added');
  res.redirect(`/tickets/${id}`);
}

const uploadAttachment = upload.single('attachment');

async function postAttachment(req, res) {
  const id = req.params.id;
  if (!req.file) {
    req.flash('error', 'No file');
    return res.redirect(`/tickets/${id}`);
  }
  await addAttachment(id, req.user.id, req.file);
  req.flash('success', 'Attachment added');
  res.redirect(`/tickets/${id}`);
}

async function postAssign(req, res) {
  const id = req.params.id;
  const assigneeId = Number(req.body.assignee_id);
  await assignTicket(id, assigneeId);
  const [[ticket], [technician], [creator]] = await Promise.all([
    pool.query('SELECT id, title FROM tickets WHERE id = ?', [id]).then(([r]) => r),
    pool.query('SELECT id, name, email FROM users WHERE id = ?', [assigneeId]).then(([r]) => r),
    pool.query('SELECT id, name, email FROM users WHERE id = (SELECT creator_id FROM tickets WHERE id = ?)', [id]).then(([r]) => r)
  ]);
  await sendTicketAssignedEmail(ticket, technician, creator);
  req.flash('success', 'Ticket assigned');
  res.redirect(`/tickets/${id}`);
}

async function postInProgress(req, res) {
  const id = req.params.id;
  await require('../models/ticketModel').startProgress(id);
  req.flash('success', 'Ticket marked In Progress');
  res.redirect(`/tickets/${id}`);
}

async function postResolve(req, res) {
  const id = req.params.id;
  await resolveTicket(id);
  const [[ticket], [technician], [creator]] = await Promise.all([
    pool.query('SELECT id, title, assignee_id FROM tickets WHERE id = ?', [id]).then(([r]) => r),
    pool.query('SELECT id, name, email FROM users WHERE id = (SELECT assignee_id FROM tickets WHERE id = ?)', [id]).then(([r]) => r),
    pool.query('SELECT id, name, email FROM users WHERE id = (SELECT creator_id FROM tickets WHERE id = ?)', [id]).then(([r]) => r)
  ]);
  await sendTicketResolvedEmail(ticket, technician, creator);
  req.flash('success', 'Ticket resolved');
  res.redirect(`/tickets/${id}`);
}

module.exports = { list, getCreate, postCreate, show, getEdit, postEdit, postDelete, postComment, uploadAttachment, postAttachment, postAssign, postInProgress, postResolve };
