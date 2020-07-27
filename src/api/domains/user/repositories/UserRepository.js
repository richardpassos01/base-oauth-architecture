class UserRepository {
  constructor(params = {}) {
    this.mongo = params.mongo;
    this.postgres = params.postgres;
  }

  async getUserByIdentificator({ username, email, document }) {
    const { User } = await this.mongo.models();

    return User.findOne({
      $or: [
        { email },
        { document },
        { username }
      ]
    });
  }

  async getUserByIdentificatorAndValidate({
    username,
    email,
    document,
    password
  }) {
    const user = await this.getUserByIdentificator({ username, email, document });
    const validated = user.validPassword(password);

    return {
      user,
      validated
    };
  }

  async create({
    username,
    email,
    document,
    fullName,
    password,
    roles
  }) {
    const { User } = await this.mongo.models();
    const user = new User({
      username,
      email,
      document,
      fullName,
      roles
    });

    user.setPassword(password);

    return user.save();
  }
}

module.exports = UserRepository;
