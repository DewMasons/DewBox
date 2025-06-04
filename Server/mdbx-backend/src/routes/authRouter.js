const express = require('express');
const AuthController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/register', (req, res, next) => {
    console.log('[ROUTE] POST /auth/register accessed. Body:', req.body);
    next();
}, AuthController.register);
authRouter.post('/login', (req, res, next) => {
    console.log('[ROUTE] POST /auth/login accessed. Body:', req.body);
    next();
}, AuthController.login);
authRouter.get('/check', authenticateToken, (req, res, next) => {
    console.log('[ROUTE] GET /auth/check accessed by user:', req.user.id);
    next();
}, (req, res) => {
    res.status(200).json({ message: 'Authenticated', user: req.user });
});

module.exports = authRouter;
