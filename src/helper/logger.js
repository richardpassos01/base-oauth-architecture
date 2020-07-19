const debug = require('debug')('BASE-REPOSITORY:');

const date = new Date();

const error = (err) => {
  debug('ERROR', {
    err,
    date
  });
};

const log = (info) => {
  debug('LOG', {
    info,
    date
  });
};

module.exports = {
  error,
  log
};
