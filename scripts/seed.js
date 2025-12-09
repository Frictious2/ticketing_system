require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function run() {
  await pool.query('DELETE FROM ticket_attachments');
  await pool.query('DELETE FROM ticket_comments');
  await pool.query('DELETE FROM tickets');
  await pool.query('DELETE FROM users');
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'seeds.sql'), 'utf8');
  await pool.query(sql);
  console.log('Seeding complete');
  process.exit(0);
}

run();

