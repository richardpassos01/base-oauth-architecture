const { OK, BAD_REQUEST } = require('http-status-codes');
const logger = require('../../../../helper/logger');

class AuthController {
  constructor(params) {
    this.service = params.service;
  }

  async verifyTokenAndAuthenticate(req, res) {
    const { refreshToken } = req.body;

    return this.service.verifyTokenAndAuthenticate({
      refreshToken
    })
      .then((token) => res.status(OK).json(token))
      .catch((err) => {
        logger.error(err);
        res.status(BAD_REQUEST).send({
          message: err.message
        });
      });
  }

  async verifyUserAndAuthenticate(req, res) {
    const {
      username,
      email,
      document,
      password,
      refreshToken
    } = req.body;

    return this.service.verifyUserAndAuthenticate({
      username,
      email,
      document,
      password,
      refreshToken
    })
      .then((token) => res.status(OK).json(token))
      .catch((err) => {
        logger.error(err);
        res.status(BAD_REQUEST).send({
          message: err.message
        });
      });
  }
}

module.exports = AuthController;
