exports.createApplication = async (db, data = {}) => {
  if (!db) throw new Error('DB required');

  const { userId, loanId, ...fields } = data;

  if (!userId || !loanId) {
    throw new Error('userId and loanId required');
  }

  // create application
  const [result] = await db.execute(
    `INSERT INTO applications (user_id, loan_id, status)
     VALUES (?, ?, 'submitted')`,
    [userId, loanId]
  );

  const applicationId = result.insertId;

  // store ALL fields dynamically
  for (const key in fields) {
    await db.execute(
      `INSERT INTO application_data
      (application_id, field_name, field_value)
      VALUES (?, ?, ?)`,
      [
        applicationId,
        key,
        fields[key] ?? null,
      ]
    );
  }

  return { applicationId };
};


exports.getMyApplications = async (db, userId) => {

  if (!db) {
    throw new Error('DB required');
  }

  // applications
  const [apps] = await db.execute(
    `SELECT
      a.*,

      la.approved_amount,
      la.interest_rate,
      la.tenure_months

     FROM applications a

     LEFT JOIN loan_approvals la
       ON a.id = la.application_id

     WHERE a.user_id = ?

     ORDER BY a.id DESC`,
    [userId]
  );

  if (!apps.length) {
    return [];
  }

  const appIds = apps.map((a) => a.id);

  // dynamic fields
  const [fields] = await db.execute(
    `SELECT *
     FROM application_data
     WHERE application_id IN (${appIds.map(() => '?').join(',')})`,
    appIds
  );

  const grouped = {};

  fields.forEach((field) => {

    if (!grouped[field.application_id]) {
      grouped[field.application_id] = {};
    }

    grouped[field.application_id][field.field_name] =
      field.field_value;

  });

  return apps.map((app) => ({

    id: app.id,
    loanId: app.loan_id,
    status: app.status,
    createdAt: app.created_at,

    approvedAmount: app.approved_amount,
    interestRate: app.interest_rate,
    tenureMonths: app.tenure_months,

    ...(grouped[app.id] || {}),

  }));

};



//Admin side
exports.getAllApplications = async (db) => {

  const [rows] = await db.execute(
    `SELECT
      a.id,
      a.loan_id,
      a.status,
      a.created_at,

      la.approved_amount,
      la.interest_rate,
      la.tenure_months,

      d.field_name,
      d.field_value

    FROM applications a

    LEFT JOIN loan_approvals la
      ON a.id = la.application_id

    INNER JOIN application_data d
      ON a.id = d.application_id

    ORDER BY a.id DESC`
  );

  const map = new Map();

  for (const row of rows) {

    if (!map.has(row.id)) {

      map.set(row.id, {
        id: row.id,
        loanId: row.loan_id,
        status: row.status,
        createdAt: row.created_at,

        approvedAmount: row.approved_amount,
        interestRate: row.interest_rate,
        tenureMonths: row.tenure_months,
      });

    }

    map.get(row.id)[row.field_name] =
      row.field_value;
  }

  return Array.from(map.values());
};



exports.getApplicationById = async (db, id) => {

  const [rows] = await db.execute(
    `SELECT
      a.id,
      a.loan_id,
      a.status,

      la.approved_amount,
      la.interest_rate,
      la.tenure_months,

      d.field_name,
      d.field_value

    FROM applications a

    LEFT JOIN loan_approvals la
      ON a.id = la.application_id

    INNER JOIN application_data d
      ON a.id = d.application_id

    WHERE a.id = ?`,
    [id]
  );

  if (!rows.length) {
    return null;
  }

  const application = {
    id: rows[0].id,
    loanId: rows[0].loan_id,
    status: rows[0].status,

    approvedAmount: rows[0].approved_amount,
    interestRate: rows[0].interest_rate,
    tenureMonths: rows[0].tenure_months,
  };

  rows.forEach((row) => {
    application[row.field_name] =
      row.field_value;
  });

  return application;
};

exports.updateApplicationStatus = async (
  db,
  id,
  status
) => {

  await db.execute(
    `UPDATE applications
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return true;
};