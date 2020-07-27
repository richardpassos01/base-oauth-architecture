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

  async listUsers({ userId = null } = {}) {
    const { User, AuditLog } = await this.mongo.models();
    const findAll = userId ? { _id: userId } : null;

    const users = await User.find(findAll).sort('-createdAt');

    await AuditLog.create({
      date: new Date(),
      log: {
        type: 'list',
        data: users
      }
    });

    return users;
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

    // const { User, AuditLog } = await this.mongo.models();

    // await AuditLog.create({
    //   date: new Date(),
    //   log: {
    //     type: 'create',
    //     data: user
    //   }
    // });

    return user.save();
  }

  async listMultiDatabaseUsers() {
    const { user: postgresUserModel } = await this.postgres.models();
    const { User: mongoUserModel, AuditLog } = await this.mongo.models();

    const postgresUsers = await postgresUserModel.findAll();
    const mongoUsers = await mongoUserModel.find().sort('-createdAt');

    const allUsers = [...postgresUsers, ...mongoUsers];

    await AuditLog.create({
      date: new Date(),
      log: {
        type: 'list postgres and mongo users'
      }
    });

    return allUsers;
  }
}

module.exports = UserRepository;
