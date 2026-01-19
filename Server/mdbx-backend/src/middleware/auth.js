const jwt = require('jsonwebtoken');

// ✅ SECURITY FIX: No fallback - JWT_SECRET must be set
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRITICAL SECURITY ERROR: JWT_SECRET is not set in environment variables!');
  console.error('Generate one with: openssl rand -base64 64');
  process.exit(1);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'No token provided' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // ✅ SECURITY: Distinguish between expired and invalid tokens
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          status: 'error',
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      return res.status(403).json({ 
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
