const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");
const { hashPassword, validatePassword } = require("../utils/hash");
const userModel = new UserModel();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class AuthService {
    async createUser(userData) {
        // Check if user exists by mobile
        if (!userData.mobile || !userData.password) {
            throw new Error('Mobile and password are required');
        }
        const existing = await userModel.getUserByMobile(userData.mobile);
        if (existing) {
            throw new Error('Mobile already registered');
        }
        userData.password = await hashPassword(userData.password);
        userData.fullName = userData.fullName || userData.name || `${userData.firstname || ''} ${userData.surname || ''}`.trim();
        const newUser = await userModel.create(userData);
        if (!newUser) throw new Error('Failed to create user');
        // Use JWT as the token
        const token = jwt.sign({ id: newUser.id, mobile: newUser.mobile }, JWT_SECRET, { expiresIn: '7d' });
        if (!token) throw new Error('Failed to generate token');
        return { user: newUser, token };
    }

    async getUserByMobile(mobile) {
        return await userModel.getUserByMobile(mobile);
    }

    async loginUser(mobile, password) {
        if (!mobile || !password) return { user: null, token: null };

        // Normalize mobile number format
        // Standardize to 234XXXXXXXXXX (International format without +)

        // Remove all non-numeric characters (including +)
        mobile = mobile.replace(/\D/g, '');

        // If it starts with 0, replace with 234
        if (mobile.startsWith('0')) {
            mobile = '234' + mobile.slice(1);
        }
        // If it doesn't start with 234 and is 10 digits, assume it needs 234 (unlikely but safe)
        if (!mobile.startsWith('234') && mobile.length === 10) {
            mobile = '234' + mobile;
        }

        console.log('[AUTH DEBUG] Normalized mobile:', mobile);

        const user = await this.getUserByMobile(mobile);
        console.log('[AUTH DEBUG] loginUser: user found:', user ? 'Yes' : 'No');
        if (!user) return { user: null, token: null };
        const isMatch = await validatePassword(password, user.password);
        console.log('[AUTH DEBUG] loginUser: password match:', isMatch);
        if (!isMatch) return { user: null, token: null };
        // Use JWT as the token
        const token = jwt.sign({ id: user.id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });
        return { user, token };
    }
}

module.exports = new AuthService();
module.exports.userModel = userModel;
