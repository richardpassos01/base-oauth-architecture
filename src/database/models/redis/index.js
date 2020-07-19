const redis = require('ioredis');
const logger = require('../../../helper/logger');
const {
  clients:
  {
    redis: {
      port,
      host,
      db,
      isEnabled
    }
  }
} = require('../../../helper/settings');
const { redis: { expireIn } } = require('../../../helper/enumHelper');

class RedisClient {
  constructor(params = {}) {
    this.redisClient = isEnabled ? redis.createClient({ port, host, db }) : params.redisClient;
  }

  async get(key) {
    try {
      const results = await this.redisClient.get(key);

      return JSON.parse(results);
    } catch (err) {
      logger.error(err);

      return null;
    }
  }

  async del(key) {
    try {
      return this.redisClient.del(key);
    } catch (err) {
      logger.error(err);

      return err;
    }
  }

  async set(key, value, ttl = expireIn.twentyFourHours) {
    try {
      return this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
      logger.error(err);

      return err;
    }
  }

  async keys(key) {
    try {
      return this.redisClient.keys(key);
    } catch (err) {
      logger.error(err);

      return null;
    }
  }

  async deleteKeysByMatchingPattern(pattern) {
    try {
      const values = await this.keys(pattern);

      return !values.length || this.del(values);
    } catch (err) {
      logger.error(err);

      return err;
    }
  }

  async getAll(pattern) {
    try {
      const keys = await this.keys(pattern);
      const resolveResult = [];
      if (keys?.length) {
        const results = await this.redisClient.mget(keys);

        results.map((item) => resolveResult.push(JSON.parse(item)));

        return resolveResult;
      }

      return resolveResult;
    } catch (err) {
      logger.error(err);

      return err;
    }
  }
}

module.exports = RedisClient;
