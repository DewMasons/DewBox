const express = require('express');
const authenticateToken = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all transactions for the user
    const [rows] = await pool.query('SELECT * FROM transaction WHERE userId = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
});

router.post('/contribute', authenticateToken, async (req, res) => {
  const { amount, description } = req.body;
  if (!amount) return res.status(400).json({ message: 'Amount is required' });
  try {
    // Get user's currency and subscriber balance
    const [userRows] = await pool.query('SELECT u.id, u.mobile, s.subscriber_id, s.available_balance, s.mtd_contributed, s.ytd_contributed, s.mtd_wallets, s.ytd_wallets, s.mtd_esusu, s.ytd_esusu, s.mtd_purchases, s.ytd_purchases, s.currency FROM users u JOIN subscriber s ON u.id = s.subscriber_id WHERE u.id = ?', [req.user.id]);
    if (userRows.length === 0) return res.status(404).json({ message: 'User or subscriber not found' });
    const user = userRows[0];
    // Insert transaction
    const [result] = await pool.query(
      'INSERT INTO transaction (id, type, amount, currency, status, createdAt, userId) VALUES (UUID(), ?, ?, ?, ?, NOW(6), ?)',
      ['contribution', amount, user.currency, 'completed', req.user.id]
    );
    // Update subscriber balances
    const newAvailableBalance = parseFloat(user.available_balance) + parseFloat(amount);
    const newMtdContributed = parseFloat(user.mtd_contributed) + parseFloat(amount);
    const newYtdContributed = parseFloat(user.ytd_contributed) + parseFloat(amount);
    await pool.query('UPDATE subscriber SET available_balance = ?, mtd_contributed = ?, ytd_contributed = ? WHERE subscriber_id = ?', [newAvailableBalance, newMtdContributed, newYtdContributed, user.subscriber_id]);
    res.status(201).json({ id: result.insertId, type: 'contribution', amount, currency: user.currency, status: 'completed', userId: req.user.id, available_balance: newAvailableBalance, mtd_contributed: newMtdContributed, ytd_contributed: newYtdContributed });
  } catch (err) {
    res.status(500).json({ message: 'Failed to contribute', error: err.message });
  }
});

module.exports = router;
