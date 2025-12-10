const authService = require('../services/authService');

class AuthController {
    static async register(req, res) {
        try {
            const { user, token } = await authService.createUser(req.body);
            return res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                user,
                token
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Internal server error during registration'
            });
        }
    }

    static async login(req, res) {
        try {
            const { mobile, password } = req.body;
            if (!mobile || !password) {
                return res.status(400).json({ status: 'error', message: 'Mobile and password are required' });
            }
            const { user, token } = await authService.loginUser(mobile, password);
            if (!user) {
                return res.status(401).json({ status: 'error', message: 'Invalid mobile or password' });
            }
            return res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                user,
                token
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Internal server error during login'
            });
        }
    }
}

module.exports = AuthController;
