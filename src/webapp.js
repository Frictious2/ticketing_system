require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { router: authRouter } = require('./routes/auth');
const { router: ticketRouter } = require('./routes/tickets');
const { router: dashboardRouter } = require('./routes/dashboard');
require('./config/passport');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(helmet());
app.use(morgan('dev'));

const sessionSecret = process.env.SESSION_SECRET || 'dev_secret_change_me';
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

app.use('/auth', authRouter);
app.use('/tickets', ticketRouter);
app.use('/dashboard', dashboardRouter);

app.use((req, res) => {
  res.status(404).render('errors/404');
});

module.exports = app;

