exports.loadIn = function loadIn(database) {
  database.define('user', {
    name: String
  }, {
    timestamps: false
  });
};
