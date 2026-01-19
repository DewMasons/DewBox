const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Audit Logger Middleware
 * Logs all significant actions for compliance and security
 */

// Audit log function
async function auditLog(action, entityType, entityId, userId, details, req) {
  try {
    const severity = determineSeverity(action);
    
    await db.query(
      `INSERT INTO audit_log 
      (id, action, entity_type, entity_id, user_id, ip_address, user_agent, 
       request_method, request_path, request_body, changes, severity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        action,
        entityType,
        entityId || null,
        userId || null,
        req?.ip || req?.connection?.remoteAddress || 'unknown',
        req?.get('user-agent') || 'unknown',
        req?.method || 'SYSTEM',
        req?.path || 'N/A',
        req?.body ? JSON.stringify(sanitizeBody(req.body)) : null,
        details ? JSON.stringify(details) : null,
        severity
      ]
    );
  } catch (error) {
    // Don't throw - audit failure shouldn't break application
    console.error('❌ Audit logging failed:', error.message);
  }
}

// Determine severity based on action
function determineSeverity(action) {
  const criticalActions = [
    'DELETE_ACCOUNT',
    'TRANSACTION_REVERSAL',
    'ADMIN_ACCESS',
    'PASSWORD_RESET',
    'ACCOUNT_LOCKED',
    'DATA_BREACH_DETECTED',
    'GDPR_DELETION'
  ];
  
  const warningActions = [
    'LOGIN_FAILED',
    'INSUFFICIENT_BALANCE',
    'RATE_LIMIT_EXCEEDED',
    'INVALID_TOKEN',
    'UNAUTHORIZED_ACCESS'
  ];
  
  const errorActions = [
    'TRANSACTION_FAILED',
    'PAYMENT_FAILED',
    'DATABASE_ERROR'
  ];
  
  if (criticalActions.includes(action)) return 'CRITICAL';
  if (warningActions.includes(action)) return 'WARNING';
  if (errorActions.includes(action) || action.includes('ERROR')) return 'ERROR';
  return 'INFO';
}

// Sanitize request body (remove sensitive data)
function sanitizeBody(body) {
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
}

// Middleware to audit all API requests
function auditMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Capture original send function
  const originalSend = res.send;
  
  res.send = function(data) {
    res.send = originalSend;
    
    // Log after response (non-blocking)
    setImmediate(() => {
      const duration = Date.now() - startTime;
      const action = `${req.method}_${req.path.replace(/\//g, '_').replace(/^_/, '')}`;
      
      // Only log significant actions (not health checks, etc.)
      if (!req.path.includes('/health') && !req.path.includes('/favicon')) {
        auditLog(
          action,
          'api_request',
          null,
          req.user?.id,
          {
            status: res.statusCode,
            duration_ms: duration,
            query: req.query
          },
          req
        );
      }
    });
    
    return res.send(data);
  };
  
  next();
}

// Specific audit functions for common actions
async function auditLogin(userId, success, req, reason = null) {
  await auditLog(
    success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    'user',
    userId,
    userId,
    { success, reason },
    req
  );
}

async function auditTransaction(transactionId, userId, type, amount, status, req) {
  await auditLog(
    `TRANSACTION_${status.toUpperCase()}`,
    'transaction',
    transactionId,
    userId,
    { type, amount, status },
    req
  );
}

async function auditBalanceChange(userId, oldBalance, newBalance, reason, req) {
  await auditLog(
    'BALANCE_UPDATED',
    'user',
    userId,
    userId,
    {
      old_balance: oldBalance,
      new_balance: newBalance,
      change: newBalance - oldBalance,
      reason
    },
    req
  );
}

async function auditDataAccess(userId, dataType, dataId, req) {
  await auditLog(
    'DATA_ACCESSED',
    dataType,
    dataId,
    userId,
    { accessed_by: userId },
    req
  );
}

async function auditGDPRAction(action, userId, details, req) {
  await auditLog(
    `GDPR_${action.toUpperCase()}`,
    'user',
    userId,
    userId,
    details,
    req
  );
}

module.exports = {
  auditLog,
  auditMiddleware,
  auditLogin,
  auditTransaction,
  auditBalanceChange,
  auditDataAccess,
  auditGDPRAction
};
