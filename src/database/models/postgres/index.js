const { Sequelize } = require('sequelize');

const schemasConfig = require('./schemas');
const {
  clients:
  {
    postgres:
    {
      port,
      host,
      db,
      username,
      password,
      isEnabled
    }
  }
} = require('../../../helper/settings');

let models = null;

class PostgresClient {
  constructor(params = {}) {
    this.postgresClient = isEnabled ?
      new Sequelize(db, username, password, {
        host,
        port,
        dialect: 'postgres'
      })
      : params.postgresClient;
  }

  async models() {
    if (models) {
      return models;
    }

    const database = await this.postgresClient;
    schemasConfig.loadIn(database);
    models = database.models;

    return models;
  }
}

module.exports = PostgresClient;
