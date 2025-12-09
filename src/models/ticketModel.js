const { pool } = require('../config/db');

async function createTicket(data) {
  const [result] = await pool.query(
    'INSERT INTO tickets (title, description, priority, issue_type, status, creator_id, assignee_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.title, data.description, data.priority, data.issue_type, 'open', data.creator_id, data.assignee_id || null]
  );
  return { id: result.insertId, ...data, status: 'open' };
}

async function listTickets() {
  const [rows] = await pool.query(
    'SELECT t.*, u.name as creator_name, a.name as assignee_name FROM tickets t LEFT JOIN users u ON u.id = t.creator_id LEFT JOIN users a ON a.id = t.assignee_id ORDER BY t.created_at DESC'
  );
  return rows;
}

async function getTicket(id) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
  return rows[0] || null;
}

async function updateTicket(id, data) {
  const [res] = await pool.query(
    'UPDATE tickets SET title = ?, description = ?, priority = ?, issue_type = ?, updated_at = NOW() WHERE id = ?',
    [data.title, data.description, data.priority, data.issue_type, id]
  );
  return res.affectedRows > 0;
}

async function deleteTicket(id) {
  const [res] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

async function assignTicket(id, assignee_id) {
  const [res] = await pool.query('UPDATE tickets SET assignee_id = ?, updated_at = NOW() WHERE id = ?', [assignee_id, id]);
  return res.affectedRows > 0;
}

async function startProgress(id) {
  const [res] = await pool.query('UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?', ['in_progress', id]);
  return res.affectedRows > 0;
}

async function resolveTicket(id) {
  const [res] = await pool.query('UPDATE tickets SET status = ?, resolved_at = NOW(), updated_at = NOW() WHERE id = ?', ['resolved', id]);
  return res.affectedRows > 0;
}

async function stats() {
  const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM tickets');
  const [[{ open }]] = await pool.query("SELECT COUNT(*) as open FROM tickets WHERE status IN ('open','in_progress')");
  const [[{ resolved }]] = await pool.query("SELECT COUNT(*) as resolved FROM tickets WHERE status = 'resolved'");
  const [byPriority] = await pool.query('SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority');
  const [byIssueType] = await pool.query('SELECT issue_type, COUNT(*) as count FROM tickets GROUP BY issue_type');
  return { total, open, resolved, byPriority, byIssueType };
}

module.exports = { createTicket, listTickets, getTicket, updateTicket, deleteTicket, assignTicket, startProgress, resolveTicket, stats };

