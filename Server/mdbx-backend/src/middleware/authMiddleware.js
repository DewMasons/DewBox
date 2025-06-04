const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/APIResponse');

class AuthMiddleware {
    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return APIResponse.error(res, 'Authorization token missing', 401);
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return APIResponse.error(res, 'Invalid or expired token', 401);
        }
    }
}

module.exports = new AuthMiddleware();
