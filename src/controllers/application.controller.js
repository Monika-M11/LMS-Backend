const applicationService =
  require('../services/application.service');

exports.createApplication = async (request, reply) => {
  try {

   const result =
  await applicationService.createApplication(
    request.server.db,
    request.body
  );

    return reply.send({
      success: true,
      applicationId: result.applicationId,
    });

  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to create application',
    });
  }
};

exports.getMyApplications = async (request, reply) => {
  try {

    const userId = request.body?.userId;

    const applications =
      await applicationService.getMyApplications(
        request.server.db,
        userId
      );

    return reply.send({
      success: true,
      applications,
    });

  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};



exports.getAllApplications = async (req, reply) => {

  try {

    const data =
      await applicationService.getAllApplications(
        req.server.db
      );

    reply.send({
      success: true,
      applications: data,
    });

  } catch (err) {

    reply.code(500).send({
      success: false,
      message: err.message,
    });

  }
};

exports.getApplicationById = async (req, reply) => {

  try {

    const data =
      await applicationService.getApplicationById(
        req.server.db,
        req.params.id
      );

    reply.send({
      success: true,
      application: data,
    });

  } catch (err) {

    reply.code(500).send({
      success: false,
      message: err.message,
    });

  }
};

exports.updateApplicationStatus =
  async (req, reply) => {

    try {

      const { status } = req.body;

      await applicationService.updateApplicationStatus(
        req.server.db,
        req.params.id,
        status
      );

      reply.send({
        success: true,
      });

    } catch (err) {

      reply.code(500).send({
        success: false,
        message: err.message,
      });

    }

};