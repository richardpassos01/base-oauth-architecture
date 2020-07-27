const UserFactory = require('../factories/auth');

const userController = UserFactory.creatreController();

exports.loadIn = function loadIn(
  router,
  controller = userController
) {
  router.post('/authenticate',
    (...args) => controller.verifyUserAndAuthenticate(...args));

  router.post('/authenticate/refresh',
    (...args) => controller.verifyTokenAndAuthenticate(...args));
};
