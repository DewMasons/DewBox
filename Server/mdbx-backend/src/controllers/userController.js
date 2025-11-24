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
            // Get the user's subscriber_id and balance from the user table
            const [userRows] = await pool.query('SELECT subscriber_id, balance FROM user WHERE id = ?', [req.user.id]);
            if (!userRows.length) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const subscriberId = userRows[0].subscriber_id;
            const balance = userRows[0].balance;
            
            // Now fetch the subscriber by id (including contribution balances)
            const [rows] = await pool.query(
                `SELECT id, firstname, surname, address1, country, state, dob, mobile, alternatePhone, 
                 currency, referral, referralPhone, nextOfKinName, nextOfKinContact, city, gender, userId,
                 contribution_mode, ica_balance, piggy_balance 
                 FROM subscribers WHERE id = ?`, 
                [subscriberId]
            );
            if (!rows.length) {
                return res.status(404).json({ message: 'Subscriber not found.' });
            }
            const subscriber = { ...rows[0], balance }; // Add balance to subscriber object
            res.status(200).json({ subscriber });
        } catch (error) {
            console.error('[GET /users/subscriber] Error:', error);
            res.status(500).json({ message: 'Server error fetching subscriber info.' });
        }
    },

    // Update user profile
    async updateProfile(req, res) {
        console.log('[PATCH /users/profile] Request received. User ID:', req.user.id, 'Body:', req.body);
        try {
            await userModel.updateProfile({
                id: req.user.id,
                ...req.body
            });
            console.log('[PATCH /users/profile] Profile updated for user:', req.user.id);
            
            // Fetch updated subscriber info
            const [userRows] = await pool.query('SELECT subscriber_id FROM user WHERE id = ?', [req.user.id]);
            const subscriberId = userRows[0]?.subscriber_id;
            const [subscriberRows] = await pool.query('SELECT * FROM subscribers WHERE id = ?', [subscriberId]);
            
            res.json({ 
                message: 'Profile updated successfully',
                subscriber: subscriberRows[0]
            });
        } catch (err) {
            console.error('[PATCH /users/profile] Error:', err);
            res.status(500).json({ message: 'Failed to update profile', error: err.message });
        }
    }
};

module.exports = UserController;
