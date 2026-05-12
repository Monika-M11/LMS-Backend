const {
  getLoanProducts,
} = require(
  '../services/loan.service'
);

const getProducts =
  async (request, reply) => {

    try {

      const products =
        await getLoanProducts();

      return reply.send({
        success: true,
        products,
      });

    } catch (error) {

      console.log(error);

      return reply.status(500).send({
        success: false,
        message:
          'Failed to fetch products',
      });

    }

};


const db =
require('../config/db');

const getSingleProduct =
  async (request, reply) => {

    try {

      const { id } =
        request.body;

      const [products] =
        await db.query(
          `
          SELECT *
          FROM loan_products
          WHERE id = ?
          `,
          [id]
        );

      if (
        products.length === 0
      ) {

        return reply
          .status(404)
          .send({
            message:
              'Product not found',
          });

      }

      reply.send({
        product:
          products[0],
      });

    } catch (error) {

      console.log(error);

      reply.status(500).send({
        message:
          'Failed to fetch product',
      });

    }

};

const loanService =
  require('../services/loan.service');

const getEligibilityFields =
  async (request, reply) => {

    try {

      const { loanId } =
        request.body;

      const fields =
        await loanService.getEligibilityFields(
          loanId
        );

      return reply.send({
        success: true,
        fields,
      });

    } catch (error) {

      return reply.status(500).send({
        success: false,
        message:
          'Failed to fetch eligibility fields',
      });

    }

};

const getEligibilityRules = async (request, reply) => {
  try {
    const { loanId } = request.body;
 
    if (!loanId) {
      return reply.status(400).send({ success: false, message: 'loanId is required' });
    }
 
    const rules = await loanService.getEligibilityRules(loanId);
    return reply.send({ success: true, rules });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ success: false, message: 'Failed to fetch eligibility rules' });
  }
};


const checkEligibility = async (req, reply) => {
  try {
    const { loanId, ...formData } = req.body;

    if (!loanId) {
      return reply.status(400).send({ 
        success: false, 
        message: 'loanId is required' 
      });
    }

    const result = await loanService.checkEligibility(loanId, formData);

    // Clean the values properly
    let eligibleAmount = 0;
    let interestRate = 0;
    let tenure = 0;

    if (result.result) {
      // Remove everything except numbers and decimal point
      eligibleAmount = Number(
        String(result.result.eligibleAmount).replace(/[^0-9.-]+/g, "")
      ) || 0;

      interestRate = Number(
        String(result.result.interestRate).replace(/[^0-9.-]+/g, "")
      ) || 0;

      tenure = Number(
        String(result.result.tenure).replace(/[^0-9.-]+/g, "")
      ) || 0;
    }

    return reply.send({
      success: true,
      eligible: result.eligible,
      failedRules: result.failedRules || [],
      result: {
        eligibleAmount,
        interestRate,
        tenure,
      },
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      success: false,
      message: 'Eligibility check failed',
    });
  }
};

//Loan Form
const getApplicationFields = async (req, reply) => {
  try {
    const { loanId } = req.body;

    const [fields] = await db.query(
      `SELECT * FROM loan_application_fields WHERE loan_product_id = ?`,
      [loanId]
    );

    return reply.send({
      success: true,
      fields,
    });

  } catch (err) {
    return reply.status(500).send({
      success: false,
      message: 'Failed to fetch application fields',
    });
  }
};

// //Admin add product


const createProduct =
  async (request, reply) => {

    try {

      const result =
        await loanService.createLoanProduct(
          request.body
        );

      return reply.send({
        success: true,
        message:
          'Loan product created',
        id: result.insertId,
      });

    } catch (error) {

      console.log(error);

      return reply.status(500).send({
        success: false,
        message:
          'Failed to create product',
      });

    }

};











const addEligibilityField = async (request, reply) => {
  try {
    const { loanId, fieldName, fieldLabel, fieldType, placeholder, isRequired } = request.body;

    if (!loanId || !fieldName || !fieldLabel) {
      return reply.status(400).send({ success: false, message: 'loanId, fieldName and fieldLabel are required' });
    }

    const result = await loanService.addEligibilityField({
      loanId, fieldName, fieldLabel, fieldType, placeholder, isRequired,
    });

    return reply.send({ success: true, message: 'Field added', id: result.insertId });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ success: false, message: 'Failed to add eligibility field' });
  }
};

const deleteEligibilityField = async (request, reply) => {
  try {
    const { id } = request.body;

    if (!id) {
      return reply.status(400).send({ success: false, message: 'Field id is required' });
    }

    await loanService.deleteEligibilityField(id);
    return reply.send({ success: true, message: 'Field deleted' });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ success: false, message: 'Failed to delete eligibility field' });
  }
};




const addEligibilityRule = async (request, reply) => {
  try {
    const { loanId, fieldName, operator, value } = request.body;

    if (!loanId || !fieldName || !operator || !value) {
      return reply.status(400).send({ success: false, message: 'loanId, fieldName, operator and value are required' });
    }

    const result = await loanService.addEligibilityRule({ loanId, fieldName, operator, value });
    return reply.send({ success: true, message: 'Rule added', id: result.insertId });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ success: false, message: 'Failed to add eligibility rule' });
  }
};

const deleteEligibilityRule = async (request, reply) => {
  try {
    const { id } = request.body;

    if (!id) {
      return reply.status(400).send({ success: false, message: 'Rule id is required' });
    }

    await loanService.deleteEligibilityRule(id);
    return reply.send({ success: true, message: 'Rule deleted' });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ success: false, message: 'Failed to delete eligibility rule' });
  }
};





module.exports = {
  getProducts,
  getSingleProduct,
  createProduct,
  getEligibilityFields,
  addEligibilityField,
  deleteEligibilityField,
  getEligibilityRules,
  addEligibilityRule,
  deleteEligibilityRule,
  checkEligibility,
  getApplicationFields,
};