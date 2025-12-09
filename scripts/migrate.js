require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration complete');
  process.exit(0);
}

run();

