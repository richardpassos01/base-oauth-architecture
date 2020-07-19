const env = require('env-var');

const exceptForTests = process.env.NODE_ENV !== 'test';

module.exports = {
  port: env
    .get('BASE_PROJECT_PORT')
    .required(exceptForTests)
    .asIntPositive(),

  logs: {
    level: env
      .get('BASE_PROJECT_LOG')
      .required(exceptForTests)
      .asString(),
    send: env
      .get('BASE_PROJECT_ENABLED_LOG')
      .required(exceptForTests)
      .asBool()
  },

  crypter: {
    secret: env
      .get('BASE_PROJECT_CRYPTER_SECRET')
      .asString(),

    jwt: {
      jwtSecret: 'baseProjectSecret'
    }
  },

  swagger: {
    path: '/swagger/'
  },

  clients: {
    redis: {
      port: env.get('REDIS_PORT').asString(),
      host: env.get('REDIS_HOST').asString(),
      db: env.get('REDIS_DB').asString(),
      isEnabled: env.get('ENABLED_REDIS').asBool()
    },
    postgres: {
      port: env.get('POSTGRES_PORT').asString(),
      host: env.get('POSTGRES_HOST').asString(),
      db: env.get('POSTGRES_DB').asString(),
      username: env.get('POSTGRES_USER').asString(),
      password: env.get('POSTGRES_PASSWORD').asString(),
      isEnabled: env.get('ENABLED_POSTGRES').asBool()
    },
    mongodb: {
      url: env.get('MONGO_QUERY_STRING').asString(),
      isEnabled: env.get('ENABLED_MONGODB').asBool()
    }
  }
};
