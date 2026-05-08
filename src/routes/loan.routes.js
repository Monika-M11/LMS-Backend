
const controller = require('../controllers/loan.controller');

async function loanRoutes(fastify, options) {

  // ── Loan Products ──────────────────────────────────────
  fastify.post('/products',       controller.getProducts);
  fastify.post('/product',        controller.getSingleProduct);
  fastify.post('/create-product', controller.createProduct);

  // ── Eligibility Fields ─────────────────────────────────
  fastify.post('/eligibility-fields',        controller.getEligibilityFields);
  fastify.post('/add-eligibility-field',     controller.addEligibilityField);
  fastify.post('/delete-eligibility-field',  controller.deleteEligibilityField);

  // ── Eligibility Rules ──────────────────────────────────
  fastify.post('/eligibility-rules',         controller.getEligibilityRules);
  fastify.post('/add-eligibility-rule',      controller.addEligibilityRule);
  fastify.post('/delete-eligibility-rule',   controller.deleteEligibilityRule);

  // ── Eligibility Check & Application ───────────────────
  fastify.post('/check-eligibility',   controller.checkEligibility);
  fastify.post('/application-fields',  controller.getApplicationFields);

}

module.exports = loanRoutes;