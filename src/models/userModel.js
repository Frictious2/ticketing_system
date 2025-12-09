const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function createUser({ name, email, password, role }) {
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, role]);
  return { id: result.insertId, name, email, role };
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { createUser, findByEmail, findById };
