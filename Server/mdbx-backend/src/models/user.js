const pool = require('../db');
const { hashPassword, validatePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');

class UserModel {
    async create(userData) {
        // Check if mobile is already registered in user table
        const [existingUser] = await pool.query('SELECT id FROM user WHERE mobile = ?', [userData.mobile]);
        if (existingUser.length > 0) {
            throw new Error('Mobile already registered');
        }
        // Insert into subscribers
        const dobFormatted = userData.dob ? new Date(userData.dob).toISOString().slice(0, 10) : null;
        const [subscriberResult] = await pool.query(
            `INSERT INTO subscribers (firstname, address1, country, state, dob, mobile, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, surname, city, gender, password, othername) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userData.firstname,
                userData.address1,
                userData.country,
                userData.state,
                dobFormatted,
                userData.mobile,
                userData.alternatePhone,
                userData.currency,
                userData.referral,
                userData.referralPhone,
                userData.nextOfKinName,
                userData.nextOfKinContact,
                userData.surname,
                userData.city,
                userData.gender,
                userData.password,
                userData.othername || null // Always provide a value for othername
            ]
        );
        const subscriberId = subscriberResult.insertId;
        // Insert into user (use 'firstname' + 'surname' for 'name')
        const fullName = `${userData.firstname || ''} ${userData.surname || ''}`.trim();
        await pool.query(
            `INSERT INTO user (id, name, email, mobile, password, balance, subscriber_id) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
            [fullName, userData.email, userData.mobile, userData.password, userData.balance || 0, subscriberId]
        );
        // Fetch the UUID of the user just inserted
        const [userRows] = await pool.query('SELECT id, name, email, mobile, password, balance FROM user WHERE mobile = ?', [userData.mobile]);
        const userId = userRows[0]?.id;
        // Insert into users table for validation (only use fields that exist)
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE mobile = ?', [userData.mobile]);
        if (existingUsers.length === 0) {
            await pool.query(
                `INSERT INTO users (email, password, mobile, random_number) VALUES (?, ?, ?, ?)`,
                [userData.email, userData.password, userData.mobile, Math.floor(100000 + Math.random() * 900000).toString()]
            );
        }
        // Update subscriber with userId
        await pool.query('UPDATE subscribers SET userId = ? WHERE id = ?', [userId, subscriberId]);
        return { ...userRows[0], subscriberId };
    }

    async getUserByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        return rows[0] || null;
    }

    async getUserByMobile(mobile) {
        const [rows] = await pool.query('SELECT * FROM user WHERE mobile = ?', [mobile]);
        return rows[0] || null;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async updateProfile({ id, name, email, mobile, city, state, country, address1, gender }) {
        // Update users table
        await pool.query('UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?', [name, email, mobile, id]);
        // Update subscriber table
        await pool.query('UPDATE subscriber SET city = ?, state = ?, country = ?, address1 = ?, gender = ? WHERE subscriber_id = ?', [city, state, country, address1, gender, id]);
    }
}

module.exports = UserModel;
