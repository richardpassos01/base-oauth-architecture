const { OK } = require('http-status-codes');
const logger = require('../../../../helper/logger');

class UserController {
  constructor(params) {
    this.service = params.service;
  }

  listUsers(req, res) {
    const { userId } = req.query;

    return this.service.listUsers({ userId })
      .then((users) => res.status(OK).json(users))
      .catch((err) => logger.error(err));
  }

  create(req, res) {
    const { name } = req.body;

    return this.service.create({ name })
      .then((user) => res.status(OK).json(user))
      .catch((err) => logger.error(err));
  }
}

module.exports = UserController;
