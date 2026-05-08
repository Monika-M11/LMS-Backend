const Fastify = require('fastify');
const cors = require('@fastify/cors');

const authRoutes = require('./routes/auth.routes');

const loanRoutes =require('./routes/loan.routes');

const customers =  require('./routes/user.routes');

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
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



module.exports = app;