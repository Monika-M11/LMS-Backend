const approvalService =
  require('../services/approval.service');


exports.approveLoan = async (
  req,
  reply
) => {

  try {

    await approvalService.approveLoan(
      req.server.db,
      req.body
    );

    reply.send({
      success: true,
      message: 'Loan approved successfully',
    });

  } catch (err) {

    req.log.error(err);

    reply.code(500).send({
      success: false,
      message: err.message,
    });

  }

};


exports.getApprovalDetails = async (
  req,
  reply
) => {

  try {

    const { applicationId } = req.body;

    const data =
      await approvalService.getApprovalDetails(
        req.server.db,
        applicationId
      );

    reply.send({
      success: true,
      approval: data,
    });

  } catch (err) {

    req.log.error(err);

    reply.code(500).send({
      success: false,
      message: err.message,
    });

  }

};