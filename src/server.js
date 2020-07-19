const settings = require('./helper/settings');
const logger = require('./helper/logger');

const PORT = settings.port || 3000;
const app = require('./app');

const exitWithError = (err) => {
  process.stderr.write(`${err}\n`);
  process.stderr.write('Process will quit...\n');
  process.exit(1);
};

const serverConfig = async () => {
  try {
    const server = await app();
    await server.listen(PORT);

    return logger.log(`server listen on ${PORT}`);
  } catch (error) {
    return exitWithError(error);
  }
};

serverConfig();
