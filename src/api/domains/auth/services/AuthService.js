const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const jwtVerifyAsync = promisify(jwt.verify, jwt);
const logger = require('../../../../helper/logger');
const {
  jwt: {
    accessTokenSecret,
    refreshTokenSecret,
    tokenExpires,
    refreshExpires
  }
} = require('../../../../helper/settings');

class AuthService {
  constructor(params = {}) {
    this.repository = params.repository;
    this.redis = params.redis;
    this.userService = params.userService;
  }

  async authenticate({ user }) {
    const accessToken = jwt.sign({ ...user }, accessTokenSecret, { expiresIn: `${tokenExpires}h` });
    const refreshToken = jwt.sign({ ...user }, refreshTokenSecret, { expiresIn: `${refreshExpires}h` });

    return {
      token_type: 'bearer',
      access_token: accessToken,
      refresh_token_in: refreshToken,
      token_expires_in: tokenExpires,
      refresh_token_expires: refreshExpires,
    };
  }

  async verifyUserAndAuthenticate({
    username,
    email,
    document,
    password
  }) {
    try {
      const user = await this.userService.getUserByIdentificatorAndValidate({
        username,
        email,
        document,
        password
      });

      const token = await this.authenticate({
        user
      });

      return token;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async verifyTokenAndAuthenticate({ refreshToken }) {
    try {
      if (!refreshToken) {
        throw new Error('Missing Token');
      }

      const { iat, exp, ...user } = await jwtVerifyAsync(refreshToken, refreshTokenSecret);

      return this.authenticate({ user });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = AuthService;
