const { OK, BAD_REQUEST } = require('http-status-codes');
const logger = require('../../../../helper/logger');

class AuthController {
  constructor(params) {
    this.service = params.service;
    this.userService = params.userService;
  }

  async authenticate(req, res) {
    const {
      username,
      email,
      document,
      password
    } = req.body;

    try {
      const user = await this.userService.getUserByIdentificatorAndValidate({
        username,
        email,
        document,
        password
      });

      const token = await this.service.authenticate({
        user
      });

      res.status(OK).json(token);
    } catch (err) {
      logger.error(err);
      res.status(BAD_REQUEST).send({
        message: err.message
      });
    }
  }
}

module.exports = AuthController;
