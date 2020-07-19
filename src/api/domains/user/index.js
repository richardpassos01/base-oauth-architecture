const path = require('path');
const fs = require('fs');
const factories = require('./factories');

function loadIn(router) {
  const normalizedPath = path.join(__dirname, './routes');

  fs.readdirSync(normalizedPath).forEach((file) => {
    if (file !== 'index.js') {
      require(`./routes/${file}`).loadIn(router); // eslint-disable-line global-require, import/no-dynamic-require
    }
  });
}

module.exports = { factories, loadIn };
