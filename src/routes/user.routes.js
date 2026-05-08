const controller =
  require('../controllers/user.controller');

async function routes(fastify) {

  fastify.post(
    '/customers',
    controller.getCustomers
  );
  
fastify.post(
  '/customer-details',
  controller.getCustomerDetails
);

fastify.post(
  '/profile',
  controller.getProfile
);

fastify.post(
  '/update-profile',
  controller.updateProfile
);



}


module.exports = routes;