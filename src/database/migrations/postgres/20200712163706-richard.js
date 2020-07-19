exports.up = function (db, callback) {
  db.createTable('base-config', {
    id: { type: 'int', primaryKey: true },
    shared_name: 'string',
    shared_email: 'string',
    shared_data: 'string'
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('base-config', callback);
};
