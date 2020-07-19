const logger = require('../../../../helper/logger');
const { redis: { key, action } } = require('../../../../helper/enumHelper');

const sanitizeAndCacheData = (data, redisClient, rediKey) => {
  const resultArray = Array.isArray(data) ? data : [data];

  resultArray.forEach((item) => {
    const { _id: id } = item;

    const resolvedKey = rediKey.replace('*', `:${id}`);
    redisClient.set(resolvedKey, item);
  });

  return data;
};

class UserService {
  constructor(params = {}) {
    this.repository = params.repository;
    this.redis = params.redis;
  }

  async listUsers({ userId = null } = {}) {
    try {
      const rediKey = key(userId, action.users.list);
      const redisPromise = userId ? this.redis.get(rediKey) : this.redis.getAll(rediKey);
      const cachedUsers = await redisPromise;
      const isValidCachedUsers = Array.isArray(cachedUsers) ? !!cachedUsers.length : !!cachedUsers;

      if (isValidCachedUsers) {
        return cachedUsers;
      }

      const result = await this.repository.listUsers({ userId });

      return sanitizeAndCacheData(result, this.redis, rediKey);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async create({ name }) {
    try {
      return this.repository.create({ name });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = UserService;
