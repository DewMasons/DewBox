const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");
const { hashPassword, validatePassword } = require("../utils/hash");
const userModel = new UserModel();

// ✅ SECURITY FIX: No fallback - JWT_SECRET must be set
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRITICAL SECURITY ERROR: JWT_SECRET is not set in environment variables!');
  console.error('Generate one with: openssl rand -base64 64');
  process.exit(1);
}

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
        // ✅ SECURITY: Generate JWT with expiration
        const token = jwt.sign(
            { 
                id: newUser.id, 
                mobile: newUser.mobile,
                iat: Math.floor(Date.now() / 1000)
            }, 
            JWT_SECRET, 
            { expiresIn: '7d' } // Token expires in 7 days
        );
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

        // Debug logging for password comparison
        console.log('[AUTH DEBUG] Input password:', password);
        console.log('[AUTH DEBUG] Input password length:', password.length);
        console.log('[AUTH DEBUG] Stored hash:', user.password);
        console.log('[AUTH DEBUG] Stored hash starts with $2:', user.password ? user.password.startsWith('$2') : 'N/A');

        const isMatch = await validatePassword(password, user.password);
        console.log('[AUTH DEBUG] loginUser: password match:', isMatch);
        if (!isMatch) return { user: null, token: null };
        
        // ✅ SECURITY: Generate JWT with expiration
        const token = jwt.sign(
            { 
                id: user.id, 
                mobile: user.mobile,
                iat: Math.floor(Date.now() / 1000)
            }, 
            JWT_SECRET, 
            { expiresIn: '7d' } // Token expires in 7 days
        );
        return { user, token };
    }
}

module.exports = new AuthService();
module.exports.userModel = userModel;
