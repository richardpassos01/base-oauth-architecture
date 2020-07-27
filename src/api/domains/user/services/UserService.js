const logger = require('../../../../helper/logger');
const { user: { roles: rolesCfg } } = require('../../../../helper/enumHelper');

class UserService {
  constructor(params = {}) {
    this.repository = params.repository;
  }

  async getUserByIdentificator({
    username,
    email,
    document
  }) {
    try {
      return this.repository.getUserByIdentificator({ username, email, document });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getUserByIdentificatorAndValidate({
    username,
    email,
    document,
    password
  }) {
    try {
      const
        {
          user: {
            _id: id,
            username: usernameFromBank,
            email: emailFromBank,
            document: documentFromBank,
            fullName,
            roles
          },
          validated
        } = await this.repository.getUserByIdentificatorAndValidate({
          username,
          email,
          document,
          password
        });

      if (!validated) {
        throw new Error('Usuario invalido');
      }

      return {
        id,
        fullName,
        email: emailFromBank,
        document: documentFromBank,
        username: usernameFromBank,
        roles
      };
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async create({
    username,
    email,
    document,
    fullName,
    password,
    roles = [rolesCfg.user]
  }) {
    try {
      const hasUser = await this.getUserByIdentificator({ username, email, document });

      if (hasUser) {
        throw new Error({ code: '1234', message: 'user already registered' });
      }

      return this.repository.create({
        username,
        email,
        document,
        fullName,
        password,
        roles
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = UserService;
