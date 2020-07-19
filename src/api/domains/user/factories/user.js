const Controller = require('../controllers/UserController');
const Service = require('../services/UserService');
const Repository = require('../repositories/UserRepository');

const Redis = require('../../../../database/models/redis');
const Mongo = require('../../../../database/models/mongodb');
const Postgres = require('../../../../database/models/postgres');

let redis;
let mongo;
let postgres;

class UserFactory {
  creatreController(params = {}) {
    const service = params.service || this.createService();

    return new Controller({ service });
  }

  createService(params = {}) {
    const repository = params.repository || this.createRepository();
    redis = redis || new Redis();

    return new Service({
      repository,
      redis
    });
  }

  createRepository() {
    mongo = mongo || new Mongo();
    postgres = postgres || new Postgres();

    return new Repository({
      mongo,
      postgres
    });
  }
}

module.exports = new UserFactory();
