exports.up = function (db, callback) {
  db.createTable('baseConfig', {
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('baseConfig', callback);
};
