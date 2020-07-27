const jwt = require('jsonwebtoken');
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
  }

  async authenticate({ user }) {
    const accessToken = jwt.sign({ ...user }, accessTokenSecret, { expiresIn: `${tokenExpires}s` });
    const refreshToken = jwt.sign({ ...user }, refreshTokenSecret, { expiresIn: `${refreshExpires}s` });

    return {
      token_type: 'bearer',
      access_token: accessToken,
      refresh_token_in: refreshToken,
      token_expires_in: tokenExpires,
      refresh_token_expires: refreshExpires,
    };
  }
}

module.exports = AuthService;
