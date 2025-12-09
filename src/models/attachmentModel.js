const { pool } = require('../config/db');

async function addAttachment(ticket_id, user_id, file) {
  const relative = `uploads/${file.filename}`;
  const [result] = await pool.query(
    'INSERT INTO ticket_attachments (ticket_id, user_id, filename, filepath, mimetype, size) VALUES (?, ?, ?, ?, ?, ?)',
    [ticket_id, user_id, file.originalname, relative, file.mimetype, file.size]
  );
  return { id: result.insertId };
}

async function listAttachments(ticket_id) {
  const [rows] = await pool.query('SELECT * FROM ticket_attachments WHERE ticket_id = ? ORDER BY created_at ASC', [ticket_id]);
  return rows;
}

module.exports = { addAttachment, listAttachments };
