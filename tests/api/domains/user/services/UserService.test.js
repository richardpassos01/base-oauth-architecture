const UserService = require('../../../../../src/api/domains/user/services/UserService');
const { defaultResult } = require('../../../../mocks/express');
const { redis: { key, action } } = require('../../../../../src/helper/enumHelper');

let service;
let repository;
let redis;
let params;
let result;

describe('#UserService', () => {
  beforeAll(() => {
    result = [defaultResult];

    params = {
      name: 'richard'
    };
  });

  beforeEach(() => {
    repository = {
      listUsers: jest.fn().mockResolvedValue(result),
      create: jest.fn().mockResolvedValue(defaultResult)
    };

    redis = {
      get: jest.fn().mockResolvedValue(null),
      getAll: jest.fn().mockResolvedValue([]),
      set: jest.fn().mockResolvedValue({})
    };

    service = new UserService({ repository, redis });
  });

  describe('#listUsers', () => {
    it('Should call all users from repository', async () => {
      const userId = null;
      const serviceResult = await service.listUsers();
      const rediKey = key(userId, action.users.list);

      expect(redis.get).not.toHaveBeenCalled();

      expect(redis.getAll).toHaveBeenCalledTimes(1);
      expect(redis.getAll).toHaveBeenCalledWith(rediKey);

      expect(repository.listUsers).toHaveBeenCalledTimes(1);
      expect(repository.listUsers).toHaveBeenCalledWith({ userId });
      expect(serviceResult).toEqual(result);
    });

    it('Should call specific user from repository', async () => {
      repository = {
        listUsers: jest.fn().mockResolvedValue(defaultResult)
      };

      service = new UserService({ repository, redis });

      const userId = '123';
      const serviceResult = await service.listUsers({ userId });
      const rediKey = key(userId, action.users.list);

      expect(redis.getAll).not.toHaveBeenCalled();

      expect(redis.get).toHaveBeenCalledTimes(1);
      expect(redis.get).toHaveBeenCalledWith(rediKey);

      expect(repository.listUsers).toHaveBeenCalledTimes(1);
      expect(repository.listUsers).toHaveBeenCalledWith({ userId });
      expect(serviceResult).toEqual(defaultResult);
    });

    it('Should call user from redis', async () => {
      redis.get = jest.fn().mockResolvedValue(defaultResult)

      service = new UserService({ repository, redis });

      const userId = '123';
      const serviceResult = await service.listUsers({ userId });
      const rediKey = key(userId, action.users.list);

      expect(redis.getAll).not.toHaveBeenCalled();

      expect(redis.get).toHaveBeenCalledTimes(1);
      expect(redis.get).toHaveBeenCalledWith(rediKey);

      expect(repository.listUsers).not.toHaveBeenCalled();
      expect(serviceResult).toEqual(defaultResult);
    });

    it('Should call all users from redis', async () => {
      redis.getAll = jest.fn().mockResolvedValue(result);

      service = new UserService({ repository, redis });

      const userId = null;
      const serviceResult = await service.listUsers();
      const rediKey = key(userId, action.users.list);

      expect(redis.get).not.toHaveBeenCalled();

      expect(redis.getAll).toHaveBeenCalledTimes(1);
      expect(redis.getAll).toHaveBeenCalledWith(rediKey);

      expect(repository.listUsers).not.toHaveBeenCalled();
      expect(serviceResult).toEqual(result);
    });
  });

  describe('#create', () => {
    it('Should call create', async () => {
      const { name } = params;
      const data = await service.create(params);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({ name });
      expect(data).toEqual(defaultResult);
    });

    it('Should throw error on create', async () => {
      const mockError = new Error("i'm a fucked unexpected error :( ");

      repository = {
        create: jest.fn().mockRejectedValue(mockError),
      };
      service = new UserService({ repository });

      await expect(service.create(params)).rejects
        .toThrow(mockError);

      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });
});
