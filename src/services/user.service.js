// const db =
//   require('../config/db');

// exports.getCustomers =
//   async () => {

//     const [rows] =
//       await db.execute(`
//         SELECT
//           id,
//           full_name,
//           email,
//           phone,
//           role,
//           created_at
//         FROM users
//         WHERE role = 'user'
//         ORDER BY created_at DESC
//       `);

//     return rows;

// };


// exports.getCustomerDetails =
//   async (id) => {
//     // Defensive: mysql2 cannot bind undefined
//     if (id === undefined || id === null) {
//       throw new TypeError('Customer id is required');
//     }

//     const [rows] = await db.execute(`
//       SELECT *
//       FROM users
//       WHERE id = ?
//     `, [id]);

//     return rows[0];
// };


// exports.getProfile = async (userId) => {
//   if (!userId || isNaN(userId)) {
//     throw new Error('Valid userId is required');
//   }

//   const [rows] = await db.execute(
//     `SELECT * FROM users WHERE id = ?`,
//     [userId]
//   );

//   return rows[0];
// };


// exports.updateProfile = async (data) => {
//   const {
//     userId, fullName, phone, email, dob, gender, maritalStatus,
//     address, city, state, pincode, employmentType, companyName,
//     monthlyIncome, workExperience, aadhaar, pan
//   } = data;

//   const bind = [
//     fullName, phone, email, dob, gender, maritalStatus,
//     address, city, state, pincode, employmentType, companyName,
//     monthlyIncome, workExperience, aadhaar, pan, userId
//   ].map(v => v === undefined ? null : v);

//   // Check if all required fields are filled
//   const isComplete = !!(
//     fullName && phone && email && dob && gender &&
//     address && city && state && pincode && aadhaar && pan
//   );

//   await db.execute(`
//     UPDATE users
//     SET
//       full_name = ?,
//       phone = ?,
//       email = ?,
//       dob = ?,
//       gender = ?,
//       marital_status = ?,
//       address = ?,
//       city = ?,
//       state = ?,
//       pincode = ?,
//       employment_type = ?,
//       company_name = ?,
//       monthly_income = ?,
//       work_experience = ?,
//       aadhaar = ?,
//       pan = ?,
//       profile_completed = ?
//     WHERE id = ?
//   `, [...bind, isComplete ? 1 : 0]);

//   return { success: true };
// };






const db = require('../config/db');

exports.getCustomers = async () => {
  const [rows] = await db.execute(`
    SELECT
      id,
      full_name,
      email,
      phone,
      role,
      created_at
    FROM users
    WHERE role = 'user'
    ORDER BY created_at DESC
  `);

  return rows;
};

exports.getCustomerDetails = async (id) => {
  // Defensive: mysql2 cannot bind undefined
  if (id === undefined || id === null) {
    throw new TypeError('Customer id is required');
  }

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  );

  return rows[0];
};

exports.getProfile = async (userId) => {
  if (userId === undefined || userId === null) {
    throw new TypeError('Valid userId is required');
  }

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE id = ?`,
    [userId]
  );

  return rows[0];
};

exports.updateProfile = async (data) => {
  const {
    userId,
    fullName,
    phone,
    email,
    dob,
    gender,
    maritalStatus,
    address,
    city,
    state,
    pincode,
    employmentType,
    companyName,
    monthlyIncome,
    workExperience,
    aadhaar,
    pan,
  } = data;

  // profile_completed = 1 only when every field has a non-empty value
  const requiredFields = [
    fullName,
    phone,
    email,
    dob,
    gender,
    maritalStatus,
    address,
    city,
    state,
    pincode,
    employmentType,
    companyName,
    monthlyIncome,
    workExperience,
    aadhaar,
    pan,
  ];

  const profileCompleted = requiredFields.every(
    (v) => v !== null && v !== undefined && String(v).trim() !== ''
  )
    ? 1
    : 0;

  // Defensive: mysql2 cannot bind undefined; convert undefined -> null
  const bind = [
    fullName,
    phone,
    email,
    dob,
    gender,
    maritalStatus,
    address,
    city,
    state,
    pincode,
    employmentType,
    companyName,
    monthlyIncome,
    workExperience,
    aadhaar,
    pan,
    profileCompleted,
    userId,
  ].map((v) => (v === undefined ? null : v));

  await db.execute(
    `
    UPDATE users
    SET
      full_name        = ?,
      phone            = ?,
      email            = ?,
      dob              = ?,
      gender           = ?,
      marital_status   = ?,
      address          = ?,
      city             = ?,
      state            = ?,
      pincode          = ?,
      employment_type  = ?,
      company_name     = ?,
      monthly_income   = ?,
      work_experience  = ?,
      aadhaar          = ?,
      pan              = ?,
      profile_completed = ?
    WHERE id = ?
    `,
    bind
  );
};