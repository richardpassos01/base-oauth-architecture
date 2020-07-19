module.exports = Object.freeze({
  redis: {
    key(userId, action) {
      const options = {
        action: `base-project::action:${action}`,
        id: `::userId:${userId}`,
        pattern: '::userId*'
      };

      return userId ?
        `${options.action}${options.id}` :
        `${options.action}${options.pattern}`;
    },
    expireIn: {
      twentyFourHours: 86400
    },
    action: {
      users: {
        list: 'listUsers'
      }
    }
  }
});
