const nodemailer = require('nodemailer');

function createTransport() {
  if (process.env.MAIL_MODE === 'json') {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

const transporter = createTransport();

async function sendTicketAssignedEmail(ticket, technician, creator) {
  const to = [technician.email, creator.email].filter(Boolean).join(',');
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    to,
    subject: `Ticket Assigned: #${ticket.id} ${ticket.title}`,
    text: `Ticket #${ticket.id} has been assigned to ${technician.name}.`
  });
  return info;
}

async function sendTicketResolvedEmail(ticket, technician, creator) {
  const to = [technician.email, creator.email].filter(Boolean).join(',');
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    to,
    subject: `Ticket Resolved: #${ticket.id} ${ticket.title}`,
    text: `Ticket #${ticket.id} has been resolved.`
  });
  return info;
}

module.exports = { transporter, sendTicketAssignedEmail, sendTicketResolvedEmail };

