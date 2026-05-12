const controller =
  require('../controllers/approval.controller');

async function routes(fastify) {

  // approve loan
  fastify.post(
    '/approve',
    controller.approveLoan
  );

  // get approval details
  fastify.post(
    '/details',
    controller.getApprovalDetails
  );

}

module.exports = routes;