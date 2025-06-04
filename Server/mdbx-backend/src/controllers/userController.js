const pool = require('../db');
const UserModel = require('../models/user');

const userModel = new UserModel();

const UserController = {
    // Get current user profile
    async getMe(req, res) {
        console.log('[GET /users/me] Request received. User ID:', req.user.id);
        try {
            const userId = req.user.id;
            const user = await userModel.findById(userId);
            if (!user) {
                console.log('[GET /users/me] User not found:', userId);
                return res.status(404).json({ message: 'User not found.' });
            }
            const formattedUser = {
                name: user.name || `${user.firstname || ''} ${user.surname || ''}`.trim(),
                email: user.email,
                mobile: user.mobile,
                balance: user.balance,
            };
            console.log('[GET /users/me] User found:', formattedUser);
            res.status(200).json({ user: formattedUser });
        } catch (error) {
            console.error('[GET /users/me] Error:', error);
            res.status(500).json({ message: 'Server error fetching profile.' });
        }
    },

    // Get subscriber info for Profile.jsx (requires token)
    async getSubscriber(req, res) {
        console.log('[GET /users/subscriber] Request received. User ID:', req.user.id);
        try {
            // Get the user's subscriber_id from the user table
            const [userRows] = await pool.query('SELECT subscriber_id FROM user WHERE id = ?', [req.user.id]);
            if (!userRows.length) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const subscriberId = userRows[0].subscriber_id;
            // Now fetch the subscriber by id
            const [rows] = await pool.query('SELECT id, firstname, surname, address1, country, state, dob, mobile, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, city, gender, userId FROM subscribers WHERE id = ?', [subscriberId]);
            if (!rows.length) {
                return res.status(404).json({ message: 'Subscriber not found.' });
            }
            const subscriber = rows[0];
            res.status(200).json({ subscriber });
        } catch (error) {
            console.error('[GET /users/subscriber] Error:', error);
            res.status(500).json({ message: 'Server error fetching subscriber info.' });
        }
    },

    // Update user profile
    async updateProfile(req, res) {
        const { name, email, mobile, city, state, country, address1, gender } = req.body;
        console.log('[PATCH /users/profile] Request received. User ID:', req.user.id, 'Body:', req.body);
        try {
            // Update users table
            await userModel.updateProfile({
                id: req.user.id,
                name,
                email,
                mobile,
                city,
                state,
                country,
                address1,
                gender
            });
            console.log('[PATCH /users/profile] Profile updated for user:', req.user.id);
            res.json({ message: 'Profile updated successfully' });
        } catch (err) {
            console.error('[PATCH /users/profile] Error:', err);
            res.status(500).json({ message: 'Failed to update profile', error: err.message });
        }
    }
};

module.exports = UserController;
