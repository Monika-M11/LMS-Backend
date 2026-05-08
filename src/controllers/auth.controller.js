const bcrypt = require('bcrypt');

const {
  findUserByEmail,
} = require('../services/auth.service');

const {
  generateToken,
} = require('../utils/jwt');

const login = async (request, reply) => {

  try {

    const {
      email,
      password,
      role,
    } = request.body;

    // VALIDATION
    if (!email || !password) {

      return reply.status(400).send({
        success: false,
        message: 'Email and password required',
      });

    }

    // FIND USER
    const user = await findUserByEmail(email);

    if (!user) {

      return reply.status(401).send({
        success: false,
        message: 'User not found',
      });

    }

    // ROLE CHECK
    if (user.role !== role) {

      return reply.status(401).send({
        success: false,
        message: 'Invalid role selected',
      });

    }

    // PASSWORD CHECK
    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {

      return reply.status(401).send({
        success: false,
        message: 'Invalid password',
      });

    }

    // TOKEN
    const token = generateToken(user);

    return reply.send({
  success: true,
  token,

  user: {
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    phone: user.phone,
    profile_completed:
      user.profile_completed,
  }
});

  } catch (error) {

    console.log(error);

    return reply.status(500).send({
      success: false,
      message: 'Server error',
    });

  }

};

module.exports = {
  login,
};