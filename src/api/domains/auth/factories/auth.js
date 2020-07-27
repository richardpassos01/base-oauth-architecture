const Controller = require('../controllers/AuthController');
const AuthService = require('../services/AuthService');
const AuthRepository = require('../repositories/AuthRepository');

const UserService = require('../../user/services/UserService');
const UserRepository = require('../../user/repositories/UserRepository');

const Redis = require('../../../../database/models/redis');
const Mongo = require('../../../../database/models/mongodb');
const Postgres = require('../../../../database/models/postgres');

const define = {
  auth: {
    Service: AuthService,
    Repository: AuthRepository
  },
  user: {
    Repository: UserRepository,
    Service: UserService
  }
};

let redis;
let mongo;
let postgres;

class AuthFactory {
  creatreController(params = {}) {
    const service = params.service || this.createService({}, 'auth');
    const userService = params.userService || this.createService({}, 'user');

    return new Controller({ service, userService });
  }

  createService(params = {}, prefix) {
    const repository = params.repository || this.createRepository(prefix);
    const { [prefix]: { Service } } = define;

    redis = redis || new Redis();

    return new Service({ repository, redis });
  }

  createRepository(prefix) {
    const { [prefix]: { Repository } } = define;

    mongo = mongo || new Mongo();
    postgres = postgres || new Postgres();

    return new Repository({
      mongo,
      postgres
    });
  }
}

module.exports = new AuthFactory();
