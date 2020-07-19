exports.loadIn = function loadIn(database) {
  const auditLogSchema = new database.Schema({
    date: Date,
    log: Object
  }, {
    timestamps: true
  });

  database.model('AuditLog', auditLogSchema);
};
