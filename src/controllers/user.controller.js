const userService =
  require('../services/user.service');


exports.getCustomers =
  async (request, reply) => {

    try {

      const customers =
        await userService.getCustomers();

      return {
        success: true,
        customers,
      };

    } catch (error) {

      request.log.error(error);

      return reply.code(500).send({
        success: false,
        message:
          'Failed to fetch customers',
      });

    }



};
exports.getCustomerDetails =
  async (request, reply) => {

    try {

      // Accept id from either body or query to avoid undefined bind params
      const idRaw = request.body?.id ?? request.query?.id;
      const id = Number(idRaw);

      if (!Number.isFinite(id)) {
        return reply.code(400).send({
          success: false,
          message: 'Customer id required',
        });
      }

      const customer = await userService.getCustomerDetails(id);

      return {
        success: true,
        customer,
      };

    } catch (error) {

      request.log.error(error);

      return reply.code(500).send({
        success: false,
        message:
          'Failed to fetch customer details',
      });

    }

};

exports.getProfile =
  async (request, reply) => {

    try {

      const { userId } =
        request.body;

      const profile =
        await userService.getProfile(
          
          userId
        );

      return {
        success: true,
        profile,
      };

    } catch (error) {

      request.log.error(error);

      return reply.code(500).send({
        success: false,
        message:
          'Failed to fetch profile',
      });

    }

};


exports.updateProfile =
  async (request, reply) => {

    try {

      const result =
        await userService.updateProfile(
          
          request.body
        );

      return {
        success: true,
        message:
          'Profile updated successfully',
      };

    } catch (error) {

      request.log.error(error);

      return reply.code(500).send({
        success: false,
        message:
          'Failed to update profile',
      });

    }

};







