const controller = require(
  '../controllers/auth.controller'
);

async function authRoutes(
  fastify,
  options
) {

  fastify.post(
    '/login',
    controller.login
  );

}

module.exports = authRoutes;