const { OK, BAD_REQUEST } = require('http-status-codes');
const logger = require('../../../../helper/logger');

class UserController {
  constructor(params) {
    this.service = params.service;
  }

  create(req, res) {
    const {
      username,
      email,
      document,
      fullName,
      password,
      roles
    } = req.body;

    return this.service.create({
      username,
      email,
      document,
      fullName,
      password,
      roles
    })
      .then((user) => res.status(OK).json(user))
      .catch((err) => {
        logger.error(err);
        res.status(BAD_REQUEST).send({
          message: err.message
        });
      });
  }
}

module.exports = UserController;
