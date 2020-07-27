const Controller = require('../controllers/UserController');
const Service = require('../services/UserService');
const Repository = require('../repositories/UserRepository');

const Mongo = require('../../../../database/models/mongodb');

let mongo;

class UserFactory {
  creatreController(params = {}) {
    const service = params.service || this.createService();

    return new Controller({ service });
  }

  createService(params = {}) {
    const repository = params.repository || this.createRepository();

    return new Service({ repository });
  }

  createRepository() {
    mongo = mongo || new Mongo();

    return new Repository({ mongo });
  }
}

module.exports = new UserFactory();
