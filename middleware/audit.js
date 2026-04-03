const AuditLog = require('../models/AuditLog');

const auditLog = (action, resource, resourceId = null, details = {}) => {
  return async (req, res, next) => {
    const log = new AuditLog({
      userId: req.user ? req.user.id : null,
      action,
      resource,
      resourceId,
      details: { ...details, method: req.method, url: req.originalUrl },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    await log.save();
    next();
  };
};

module.exports = auditLog;