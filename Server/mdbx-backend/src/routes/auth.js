const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Destructure all possible fields from frontend
  const {
    name, email, mobile, password, balance,
    firstname, othername, address1, country, state, dob, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, surname, city, gender
  } = req.body;
  // Generate name if not provided
  const fullName = name && name.trim() ? name : [firstname, othername, surname].filter(Boolean).join(' ');
  try {
    // 1. Check if user already exists by mobile or email
    const [existing] = await pool.query('SELECT id FROM user WHERE mobile = ? OR email = ?', [mobile, email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Mobile or email already registered' });
    }
    // 2. Create subscriber first
    // Convert dob to 'YYYY-MM-DD' format for MySQL
    const dobFormatted = dob ? new Date(dob).toISOString().slice(0, 10) : null;
    const [subscriberResult] = await pool.query(
      `INSERT INTO subscribers (firstname, address1, country, state, dob, mobile, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, surname, city, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, address1, country, state, dobFormatted, mobile, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, surname, city, gender, password ? await bcrypt.hash(password, 10) : null]
    );
    const subscriberId = subscriberResult.insertId;
    // 3. Create user and link to subscriber
    await pool.query(
      `INSERT INTO user (id, name, email, mobile, password, balance, subscriber_id) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
      [fullName, email, mobile, password ? await bcrypt.hash(password, 10) : null, balance || 0, subscriberId]
    );
    // Fetch the UUID of the user just inserted
    const [userRows] = await pool.query('SELECT id, name, email, mobile, password, balance FROM user WHERE mobile = ? OR email = ?', [mobile, email]);
    const userId = userRows[0]?.id;
    // 3b. Insert into users table for validation (if not already present)
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      await pool.query(
        `INSERT INTO users (id, name, email, mobile, password, balance) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, fullName, email, mobile, userRows[0]?.password, balance || 0]
      );
    }
    // 4. Update subscriber with userId (if needed)
    await pool.query('UPDATE subscribers SET userId = ? WHERE id = ?', [userId, subscriberId]);
    // 5. Return user and subscriber info
    // Add hasContributed property (default false for now)
    const user = { id: userId, name, email, mobile, balance, subscriber_id: subscriberId };
    const subscriber = { id: subscriberId, firstname, address1, country, state, dob, mobile, alternatePhone, currency, referral, referralPhone, nextOfKinName, nextOfKinContact, surname, city, gender, userId };
    const hasContributed = false; // TODO: Replace with real logic if available
    const tokenPayload = { id: userId, email, mobile, hasContributed };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, subscriber, token, hasContributed });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { mobile, password } = req.body;
  
  try {
    // Try multiple mobile number formats to find the user
    const mobileFormats = [];
    
    // Original format
    mobileFormats.push(mobile);
    
    // Remove any spaces or dashes
    const cleanMobile = mobile.replace(/[\s-]/g, '');
    mobileFormats.push(cleanMobile);
    
    // If starts with +234, add 234 and 0 versions
    if (cleanMobile.startsWith('+234')) {
      mobileFormats.push(cleanMobile.slice(1)); // 234XXXXXXXXXX
      mobileFormats.push('0' + cleanMobile.slice(4)); // 0XXXXXXXXXX
    } 
    // If starts with 234, add +234 and 0 versions
    else if (cleanMobile.startsWith('234')) {
      mobileFormats.push('+' + cleanMobile); // +234XXXXXXXXXX
      mobileFormats.push('0' + cleanMobile.slice(3)); // 0XXXXXXXXXX
    }
    // If starts with 0, add 234 and +234 versions
    else if (cleanMobile.startsWith('0')) {
      mobileFormats.push('234' + cleanMobile.slice(1)); // 234XXXXXXXXXX
      mobileFormats.push('+234' + cleanMobile.slice(1)); // +234XXXXXXXXXX
    }
    // If starts with 1 (US format), add +1 version
    else if (cleanMobile.startsWith('1') && cleanMobile.length === 11) {
      mobileFormats.push('+' + cleanMobile); // +1XXXXXXXXXX
    }
    
    console.log('[AUTH DEBUG] Trying mobile formats:', mobileFormats);
    
    // Try to find user with any of the formats
    const placeholders = mobileFormats.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT * FROM user WHERE mobile IN (${placeholders})`,
      mobileFormats
    );
    
    console.log('[AUTH DEBUG] User found:', rows.length > 0 ? 'Yes' : 'No');
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user.id, email: user.email, mobile: user.mobile, hasContributed: false };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: payload, token, hasContributed: false });
  } catch (err) {
    console.error('LOGIN ERROR:', err); // Log full error to console
    res.status(500).json({ message: 'Login failed', error: err.message, stack: err.stack });
  }
});

router.get('/check', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ user });
  });
});

module.exports = router;
