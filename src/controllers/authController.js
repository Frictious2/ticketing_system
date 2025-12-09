const passport = require('passport');
const { createUser } = require('../models/userModel');

function getLogin(req, res) {
  res.render('auth/login');
}

function postLogin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info && info.message ? info.message : 'Login failed');
      return res.redirect('/auth/login');
    }
    req.logIn(user, err2 => {
      if (err2) return next(err2);
      res.redirect('/dashboard');
    });
  })(req, res, next);
}

function getRegister(req, res) {
  res.render('auth/register');
}

async function postRegister(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/register');
  }
  if (!['admin', 'technician', 'requester'].includes(role)) {
    req.flash('error', 'Invalid role');
    return res.redirect('/auth/register');
  }
  await createUser({ name, email, password, role });
  req.flash('success', 'Registration successful. Please login.');
  res.redirect('/auth/login');
}

function postLogout(req, res) {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  });
}

module.exports = { getLogin, postLogin, getRegister, postRegister, postLogout };
