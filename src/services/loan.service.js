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


const checkEligibility = async (loanId, formData) => {

  // Get Rules
  const [rules] = await db.query(
    `SELECT * FROM loan_eligibility_rules WHERE loan_product_id = ?`,
    [loanId]
  );

  // Get Product Details
  const [products] = await db.query(
    `SELECT * FROM loan_products WHERE id = ?`,
    [loanId]
  );

  const product = products[0];
  if (!product) {
    throw new Error("Loan product not found");
  }

  let eligible = true;
  const failedRules = [];

  // Check Rules
  for (const rule of rules) {
    const userValue = Number(formData[rule.field_name]);

    if (isNaN(userValue)) {
      eligible = false;
      failedRules.push({ field: rule.field_name, issue: "Invalid input" });
      continue;
    }

    const ruleValue = Number(rule.value);
    let passed = false;

    switch (rule.operator) {
      case '>=': passed = userValue >= ruleValue; break;
      case '<=': passed = userValue <= ruleValue; break;
      case '>':  passed = userValue > ruleValue; break;
      case '<':  passed = userValue < ruleValue; break;
      case '==': passed = userValue == ruleValue; break;
      default:   passed = false;
    }

    if (!passed) {
      eligible = false;
      failedRules.push({
        field: rule.field_name,
        expected: `${rule.operator} ${rule.value}`,
        actual: userValue,
      });
    }
  }

  return {
    eligible,
    failedRules,
    result: eligible ? {
      eligibleAmount: product.max_amount,
      interestRate: product.interest_rate,
      tenure: product.tenure,
    } : null,
  };
};



//Eligibility Rules

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
};
