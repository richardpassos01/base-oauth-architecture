const { OK } = require('http-status-codes');

const mockRequest = (data = {}, params = {}) => {
  const request = {
    body: {
      ...data
    },
    query: {
      ...params
    }
  };

  return request;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const defaultResult = {
  result: {
    _id: '123456',
    name: 'mock',
    createdAt: '2020-06-21T18:28:00.144Z',
    updatedAt: '2020-06-21T18:28:00.144Z'
  }
};

module.exports = {
  mockRequest,
  mockResponse,
  defaultResult
};
