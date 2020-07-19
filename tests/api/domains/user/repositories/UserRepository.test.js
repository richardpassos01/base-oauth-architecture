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

  describe('#listUsers', () => {
    it('Should list mongo Users and call AuditLog', async () => {
      const result = await repository.listUsers();

      const { User, AuditLog } = await mongo.models();

      expect(mongo.models).toHaveBeenCalledTimes(2);
      expect(mongo.models).toHaveBeenCalledWith();

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(User.find).toHaveBeenCalledWith(null);

      expect(AuditLog.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });

    it('Should get User by id', async () => {
      const { result: { _id: userId } } = defaultResult;
      const result = await repository.listUsers({ userId });

      const { User, AuditLog } = await mongo.models();

      expect(mongo.models).toHaveBeenCalledTimes(2);
      expect(mongo.models).toHaveBeenCalledWith();

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(User.find).toHaveBeenCalledWith({ _id: userId });

      expect(AuditLog.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('#create', () => {
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

  describe('#listMultiDatabaseUsers', () => {
    it('Should list users from mongo and postgres and call AuditLog', async () => {
      const result = await repository.listMultiDatabaseUsers(null);

      const { User: mongoUserModel, AuditLog } = await mongo.models();
      const { user: postgresUserModel } = await postgres.models();

      expect(mongo.models).toHaveBeenCalledTimes(2);
      expect(mongo.models).toHaveBeenCalledWith();

      expect(mongoUserModel.find).toHaveBeenCalledTimes(1);
      expect(mongoUserModel.find).toHaveBeenCalledWith();

      expect(postgresUserModel.findAll).toHaveBeenCalledTimes(1);
      expect(postgresUserModel.findAll).toHaveBeenCalledWith();

      expect(AuditLog.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual([...mockResult, ...mockResult]);
    });
  });
});
