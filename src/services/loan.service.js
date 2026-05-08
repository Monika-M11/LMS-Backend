const pool =
  require('../config/db');


  // ─── LOAN PRODUCTS ────────────────────────────────────────

const getLoanProducts =
  async () => {

    const [rows] =
      await pool.execute(
        'SELECT * FROM loan_products ORDER BY id DESC'
      );

    return rows;
};


const db =
  require('../config/db');

// GET ELIGIBILITY FIELDS
const getEligibilityFields = async (loanId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM loan_eligibility_fields WHERE loan_product_id = ?`,
    [loanId]
  );

  return rows;
};




//Eligibility Rules
const checkEligibility = async (loanId, formData) => {
  const [rules] = await db.query(
    `SELECT * FROM loan_eligibility_rules WHERE loan_product_id = ?`,
    [loanId]
  );

  let eligible = true;

  for (let rule of rules) {
    const userValue = Number(formData[rule.field_name]);
    const ruleValue = Number(rule.value);

    switch (rule.operator) {
      case '>=':
        if (!(userValue >= ruleValue)) eligible = false;
        break;

      case '<=':
        if (!(userValue <= ruleValue)) eligible = false;
        break;

      case '>':
        if (!(userValue > ruleValue)) eligible = false;
        break;

      case '<':
        if (!(userValue < ruleValue)) eligible = false;
        break;

      case '==':
        if (!(userValue == ruleValue)) eligible = false;
        break;
    }
  }

  return { eligible };
};


const getApplicationFields = async (loanId) => {
  const [rows] = await db.query(
    `SELECT * 
     FROM loan_application_fields 
     WHERE loan_product_id = ?`,
    [loanId]
  );

  return rows;
};


const createLoanProduct =
  async (data) => {

    const {
      name,
      interestRate,
      maxAmount,
      tenure,
      processingFee,
      eligibility,
    } = data;

    const [result] =
      await db.query(
        `
        INSERT INTO loan_products
        (
          name,
          interest_rate,
          max_amount,
          tenure,
          processing_fee,
          eligibility
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          name,
          interestRate,
          maxAmount,
          tenure,
          processingFee,
          eligibility,
        ]
      );

    return result;

};



const addEligibilityField = async (data) => {
  const { loanId, fieldName, fieldLabel, fieldType, placeholder, isRequired } = data;

  const [result] = await db.query(
    `INSERT INTO loan_eligibility_fields
      (loan_product_id, field_name, field_label, field_type, placeholder, is_required)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [loanId, fieldName, fieldLabel, fieldType, placeholder, isRequired ? 1 : 0]
  );

  return result;
};

const deleteEligibilityField = async (id) => {
  const [result] = await db.query(
    `DELETE FROM loan_eligibility_fields WHERE id = ?`,
    [id]
  );
  return result;
};

// ─── ELIGIBILITY RULES ────────────────────────────────────

const getEligibilityRules = async (loanId) => {
  const [rows] = await db.query(
    `SELECT * FROM loan_eligibility_rules WHERE loan_product_id = ?`,
    [loanId]
  );
  return rows;
};

const addEligibilityRule = async (data) => {
  const { loanId, fieldName, operator, value } = data;

  const [result] = await db.query(
    `INSERT INTO loan_eligibility_rules
      (loan_product_id, field_name, operator, value, logic_group)
     VALUES (?, ?, ?, ?, 1)`,
    [loanId, fieldName, operator, value]
  );

  return result;
};

const deleteEligibilityRule = async (id) => {
  const [result] = await db.query(
    `DELETE FROM loan_eligibility_rules WHERE id = ?`,
    [id]
  );
  return result;
};




module.exports = {
  getLoanProducts,
  createLoanProduct,
  getEligibilityFields,
  addEligibilityField,
  deleteEligibilityField,
  getEligibilityRules,
  addEligibilityRule,
  deleteEligibilityRule,
  checkEligibility,
  getApplicationFields,
};