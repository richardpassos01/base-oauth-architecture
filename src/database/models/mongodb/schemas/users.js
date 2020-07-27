const crypto = require('crypto');

exports.loadIn = function loadIn(database) {
  const userSchema = new database.Schema({
    email: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    document: {
      type: Number,
      required: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true
    },
    roles: {
      type: Array,
      default: [],
      required: true
    },
    hash: {
      type: String
    },
    salt: {
      type: String
    }
  }, {
    timestamps: true
  });

  userSchema.methods = {
    setPassword(password) {
      this.salt = crypto.randomBytes(16).toString('hex');
      this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    },

    validPassword(password) {
      const validHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

      return this.hash === validHash;
    }
  };

  database.model('User', userSchema);
};
