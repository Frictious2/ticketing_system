# Computer Support Ticketing System

Stack: Node.js, Express, EJS, Bootstrap, MySQL, passport-local, express-session, express-rate-limit, nodemailer.

Setup:
- Create a MySQL database `support_ticketing` and user credentials.
- Copy `.env.example` to `.env` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SESSION_SECRET`, `MAIL_MODE` (use `json` for local dev) or SMTP variables.
- Install dependencies: `npm install`.
- Run migrations: `npm run migrate`.
- Seed sample data: `npm run seed`.
- Start the app: `npm run start` and open `http://localhost:3000`.


Portfolio:
- Use the Dashboard and Tickets pages to capture screenshots.
- A print-friendly view can be produced by the browser print of each page.

