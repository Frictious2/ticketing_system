const { stats } = require('../models/ticketModel');

async function index(req, res) {
  const data = await stats();
  res.render('dashboard/index', { data });
}

module.exports = { index };

