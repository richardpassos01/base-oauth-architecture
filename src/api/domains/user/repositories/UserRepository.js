class UserRepository {
  constructor(params = {}) {
    this.mongo = params.mongo;
    this.postgres = params.postgres;
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

  async create({ name }) {
    const { User, AuditLog } = await this.mongo.models();

    const user = await User.create({
      name
    });

    await AuditLog.create({
      date: new Date(),
      log: {
        type: 'create',
        data: user
      }
    });

    return user;
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
