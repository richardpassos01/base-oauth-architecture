class AuthRepository {
  constructor(params = {}) {
    this.mongo = params.mongo;
    this.postgres = params.postgres;
  }

  async insertOnBlackList({ accessToken }) {
    return accessToken;
  }

  async checkBlackList({ accessToken }) {
    return accessToken;
  }
}

module.exports = AuthRepository;
