exports.approveLoan = async (db, data) => {

  const {
    applicationId,
    approvedAmount,
    interestRate,
    tenureMonths,
    remarks,
    approvedBy,
  } = data;

  if (
    !applicationId ||
    !approvedAmount ||
    !interestRate ||
    !tenureMonths
  ) {
    throw new Error('Missing required fields');
  }

  // check already approved
  const [existing] = await db.execute(
    `SELECT id
     FROM loan_approvals
     WHERE application_id = ?`,
    [applicationId]
  );

  if (existing.length > 0) {
    throw new Error('Loan already approved');
  }

  // insert approval details
  await db.execute(
    `INSERT INTO loan_approvals
    (
      application_id,
      approved_amount,
      interest_rate,
      tenure_months,
      remarks,
      approved_by
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      applicationId,
      approvedAmount,
      interestRate,
      tenureMonths,
      remarks || null,
      approvedBy || null,
    ]
  );

  // update application status
  await db.execute(
    `UPDATE applications
     SET status = 'approved'
     WHERE id = ?`,
    [applicationId]
  );

  return true;
};


exports.getApprovalDetails = async (
  db,
  applicationId
) => {

  const [rows] = await db.execute(
    `SELECT *
     FROM loan_approvals
     WHERE application_id = ?`,
    [applicationId]
  );

  return rows[0] || null;
};