const UserFactory = require('../factories/user');

const userController = UserFactory.creatreController();

exports.loadIn = function loadIn(
  router,
  controller = userController
) {
  router.post('/users',
    (...args) => controller.create(...args));
};
