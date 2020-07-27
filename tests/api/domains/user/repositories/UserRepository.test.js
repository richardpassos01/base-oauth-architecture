const UserRepository = require('../../../../../src/api/domains/user/repositories/UserRepository');
const { defaultResult } = require('../../../../mocks/express');

let repository;
let mongo;
let postgres;
let params;
let mockResult;

describe('#BeneficiaryRepository', () => {
  beforeAll(() => {
    mockResult = [defaultResult];

    params = {
      name: 'richard'
    };
  });

  beforeEach(() => {
    const modelUser = {
      find: jest.fn().mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce(mockResult)
      }),
      findAll: jest.fn().mockResolvedValue(mockResult),
      create: jest.fn().mockResolvedValue(defaultResult)
    };

    const create = jest.fn().mockResolvedValue(defaultResult);

    mongo = {
      models: jest.fn().mockResolvedValue({
        User: modelUser,
        mongoUserModel: modelUser,
        AuditLog: {
          create
        }
      })
    };

    postgres = {
      models: jest.fn().mockResolvedValue({
        user: modelUser,
        postgresUserModel: modelUser,
        AuditLog: {
          create
        }
      })
    };

    repository = new UserRepository({ mongo, postgres });
  });

  describe('#constructor', () => {
    it('Should construct repository without params', async () => {
      repository = new UserRepository();
    });
  });

  describe.skip('#create', () => {
    it('Should create user on mongo and call AuditLog', async () => {
      const { name } = params;
      const { result } = await repository.create({ name });

      const { User, AuditLog } = await mongo.models();

      expect(mongo.models).toHaveBeenCalledTimes(2);
      expect(mongo.models).toHaveBeenCalledWith();

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith({ name });

      expect(AuditLog.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual(result);
    });
  });
});
