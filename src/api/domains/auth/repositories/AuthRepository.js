class AuthRepository {
  constructor(params = {}) {
    this.mongo = params.mongo;
    this.postgres = params.postgres;
  }

  async get({ accessToken }) {
    return accessToken;
  }

  async create({ accessToken }) {
    return accessToken;
  }
}

module.exports = AuthRepository;
