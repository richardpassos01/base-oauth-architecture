const Controller = require('../controllers/AuthController');
const Service = require('../services/AuthService');
const AuthRepository = require('../repositories/AuthRepository');

const UserService = require('../../user/services/UserService');
const UserRepository = require('../../user/repositories/UserRepository');

const Redis = require('../../../../database/models/redis');
const Mongo = require('../../../../database/models/mongodb');
const Postgres = require('../../../../database/models/postgres');

const define = {
  auth: {
    Repository: AuthRepository
  },
  user: {
    Repository: UserRepository
  }
};

let redis;
let mongo;
let postgres;

class AuthFactory {
  creatreController(params = {}) {
    const service = params.service || this.createService();

    return new Controller({ service });
  }

  createService(params = {}) {
    redis = redis || new Redis();
    const repository = params.repository || this.createRepository('auth');
    const userRepository = params.repository || this.createRepository('user');
    const userService = new UserService({ repository: userRepository, redis });

    return new Service({ repository, redis, userService });
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
