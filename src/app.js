const Express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const routerConfig = require('./routers');
const { swaggerConfig } = require('./middlewares/swagger');
const { rateLimit } = require('./middlewares/rateLimit');

module.exports = async () => {
  const app = new Express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(compression());
  app.use(rateLimit);
  app.use(...swaggerConfig);

  routerConfig.loadIn();

  app.use('/', routerConfig.routes);

  app.get('/', function (req, res) {
    res.status(200).json({
      name: 'Base Project',
      last_update: new Date()
    });
  });

  return app;
};
