const mongoose = require('mongoose');
const schemasConfig = require('./schemas');
const { clients: { mongodb: { url, isEnabled } } } = require('../../../helper/settings');

let models = null;

class MongoClient {
  constructor(params = {}) {
    this.mongoClient = isEnabled ?
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      : params.mongoClient;
  }

  async models() {
    if (models) {
      return models;
    }

    const database = await this.mongoClient;
    schemasConfig.loadIn(database);
    models = database.models;

    return models;
  }
}

module.exports = MongoClient;
