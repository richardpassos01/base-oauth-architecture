const { OK } = require('http-status-codes');
const UserController = require('../../../../../src/api/domains/user/controllers/UserController');
const { mockResponse, mockRequest, defaultResult } = require('../../../../mocks/express');

let controller;
let service;
let res;
let req;
let result;

describe('#UserController', () => {
  beforeAll(() => {
    req = mockRequest({ name: 'richard' }, { userId: '123' });
    res = mockResponse();
    result = [defaultResult];
  });

  beforeEach(() => {
    service = {
      listUsers: jest.fn().mockResolvedValue(result),
      create: jest.fn().mockResolvedValue(result)
    };

    controller = new UserController({ service });
  });

  describe('#manipulate user table', () => {
    it('Should call listUsers service functions', async () => {
      await controller.listUsers(req, res);

      expect(service.listUsers).toHaveBeenCalledTimes(1);
      expect(service.listUsers).toHaveBeenCalledWith({
        userId: '123'
      });

      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it('Should call create service functions', async () => {
      await controller.create(req, res);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith({
        name: 'richard'
      });

      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });
});
