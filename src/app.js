const Fastify = require('fastify');
const cors = require('@fastify/cors');

const authRoutes = require('./routes/auth.routes');
const loanRoutes = require('./routes/loan.routes');
const customers = require('./routes/user.routes');
const application = require('./routes/application.routes');
const approve = require('./routes/approval.routes');

const db = require('./config/db');

const app = Fastify({
  logger: true,
});

// Make DB available as request.server.db (Fastify convention)
app.decorate('db', db);

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(authRoutes, {
  prefix: '/auth',
});

app.register(loanRoutes, {
  prefix: '/loans',
});

app.register(customers, {
  prefix: '/users',
});

app.register(application, {
  prefix: '/applications',
});

app.register(approve, {
  prefix: '/approvals',
});

module.exports = app;
