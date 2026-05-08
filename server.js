require('dotenv').config();

const app = require('./src/app');

const start = async () => {
  try {

    await app.listen({
      port: process.env.PORT,
      host: '0.0.0.0',
    });

    console.log(
      `Server running on ${process.env.PORT}`
    );

  } catch (error) {

    app.log.error(error);
    process.exit(1);

  }
};

start();