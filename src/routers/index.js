const express = require('express');

const routes = express.Router();
const path = require('path');
const fs = require('fs');

function loadIn() {
  const normalizedPath = path.join(__dirname, '../api/domains');

  fs.readdirSync(normalizedPath).forEach((file) => {
    if (file !== 'index.js') {
      require(`../api/domains/${file}`).loadIn(routes); // eslint-disable-line global-require, import/no-dynamic-require
    }
  });
}

module.exports = { routes, loadIn };
