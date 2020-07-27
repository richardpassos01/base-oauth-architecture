const logger = require('../../../../helper/logger');
const { redis: { key, action } } = require('../../../../helper/enumHelper');

const rolesCfg = {
  user: 'user'
};

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

  async getUserByIdentificator({
    username,
    email,
    document
  }) {
    try {
      return this.repository.getUserByIdentificator({ username, email, document });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getUserByIdentificatorAndValidate({
    username,
    email,
    document,
    password
  }) {
    try {
      const
        {
          user: {
            _id: id,
            username: usernameFromBank,
            email: emailFromBank,
            document: documentFromBank,
            fullName,
            roles
          },
          validated
        } = await this.repository.getUserByIdentificatorAndValidate({
          username,
          email,
          document,
          password
        });

      if (!validated) {
        throw new Error('Usuario invalido');
      }

      return {
        id,
        fullName,
        email: emailFromBank,
        document: documentFromBank,
        username: usernameFromBank,
        roles
      };
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async create({
    username,
    email,
    document,
    fullName,
    password,
    roles = [rolesCfg.user]
  }) {
    try {
      const hasUser = await this.getUserByIdentificator({ username, email, document });

      if (hasUser) {
        throw new Error({ code: '1234', message: 'user already registered' });
      }

      return this.repository.create({
        username,
        email,
        document,
        fullName,
        password,
        roles
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = UserService;
