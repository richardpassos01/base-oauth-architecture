const expressRateLimit = require('express-rate-limit');

const rateLimit = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests baby doll'
});

module.exports = {
  rateLimit
};
