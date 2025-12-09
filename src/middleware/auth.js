const { getTicket } = require('../models/ticketModel');
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

function ensureRole(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) return next();
    req.flash('error', 'Unauthorized');
    res.redirect('/');
  };
}

function ensureAnyRole(roles) {
  return (req, res, next) => {
    if (req.isAuthenticated() && roles.includes(req.user.role)) return next();
    req.flash('error', 'Unauthorized');
    res.redirect('/');
  };
}

async function ensureTicketOwner(req, res, next) {
  const id = Number(req.params.id);
  const ticket = await getTicket(id);
  if (req.isAuthenticated() && ticket && ticket.creator_id === req.user.id) return next();
  req.flash('error', 'Unauthorized');
  res.redirect('/');
}

module.exports = { ensureAuthenticated, ensureRole, ensureAnyRole, ensureTicketOwner };

