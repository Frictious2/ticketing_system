const { pool } = require('../config/db');

async function addComment(ticket_id, user_id, content) {
  const [result] = await pool.query('INSERT INTO ticket_comments (ticket_id, user_id, content) VALUES (?, ?, ?)', [ticket_id, user_id, content]);
  return { id: result.insertId };
}

async function listComments(ticket_id) {
  const [rows] = await pool.query(
    'SELECT c.*, u.name as user_name FROM ticket_comments c JOIN users u ON u.id = c.user_id WHERE c.ticket_id = ? ORDER BY c.created_at ASC',
    [ticket_id]
  );
  return rows;
}

module.exports = { addComment, listComments };

