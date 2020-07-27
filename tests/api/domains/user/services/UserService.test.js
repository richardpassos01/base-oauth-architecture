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

  describe.skip('#create', () => {
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
