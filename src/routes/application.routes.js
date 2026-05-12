module.exports = async function (fastify) {

  const {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
  } = require('../controllers/application.controller');

  fastify.post('/create', createApplication);
  fastify.post('/my-applications', getMyApplications);


  //Admin Side
  fastify.post('/all', getAllApplications);

  fastify.post('/:id', getApplicationById);

  fastify.put('/status/:id', updateApplicationStatus);

};