const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];
      if (!user) return done(null, false, { message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return done(null, false, { message: 'Invalid credentials' });
      return done(null, { id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
      return done(e);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    const user = rows[0];
    if (!user) return done(null, false);
    done(null, user);
  } catch (e) {
    done(e);
  }
});
