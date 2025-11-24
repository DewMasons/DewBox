const express = require('express');
const authenticateToken = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Determine contribution type based on date and user settings
const getContributionType = (userSettings) => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  // If user has "all_ica" mode, always return ICA
  if (userSettings.contribution_mode === 'all_ica') {
    return 'ICA';
  }
  
  // Days 2-11 are ICA period
  if (dayOfMonth >= 2 && dayOfMonth <= 11) {
    return 'ICA';
  }
  
  // Days 12-31 (and day 1) are Piggy period
  return 'PIGGY';
};

// Create contribution
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    // Get user info and settings
    const [userRows] = await pool.query(
      'SELECT u.*, s.contribution_mode, s.ica_balance, s.piggy_balance FROM user u LEFT JOIN subscribers s ON u.subscriber_id = s.id WHERE u.id = ?',
      [req.user.id]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    const user = userRows[0];
    const contributionType = getContributionType(user);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Check if user has sufficient balance
    if (parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    try {
      if (contributionType === 'ICA') {
        // ICA: Transfer to admin wallet
        const adminId = process.env.ADMIN_USER_ID || 'admin';
        
        // Deduct from user wallet
        await pool.query(
          'UPDATE user SET balance = balance - ? WHERE id = ?',
          [amount, req.user.id]
        );
        
        // Add to admin wallet
        await pool.query(
          'UPDATE user SET balance = balance + ? WHERE id = ?',
          [amount, adminId]
        );
        
        // Update user's ICA balance
        await pool.query(
          'UPDATE subscribers SET ica_balance = ica_balance + ? WHERE userId = ?',
          [amount, req.user.id]
        );
      } else {
        // PIGGY: Money stays in user wallet, just track it
        // No deduction from wallet - only update piggy_balance for tracking
        await pool.query(
          'UPDATE subscribers SET piggy_balance = piggy_balance + ? WHERE userId = ?',
          [amount, req.user.id]
        );
      }

      // Record contribution
      await pool.query(
        `INSERT INTO contributions (id, userId, type, amount, contribution_date, year, month, createdAt) 
         VALUES (UUID(), ?, ?, ?, CURDATE(), ?, ?, NOW(6))`,
        [req.user.id, contributionType, amount, year, month]
      );

      // Record in transactions table
      await pool.query(
        `INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) 
         VALUES (UUID(), ?, ?, 'NGN', 'completed', ?, NOW(6))`,
        [contributionType.toLowerCase(), amount, req.user.id]
      );

      await pool.query('COMMIT');

      res.json({
        status: 'success',
        message: `${contributionType} contribution successful`,
        data: {
          type: contributionType,
          amount: parseFloat(amount),
          description: contributionType === 'ICA' ? 'Yearly investment with interest' : 'Monthly savings',
          year,
          month
        }
      });
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Contribution error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to process contribution', 
      error: err.message 
    });
  }
});

// Get contribution info (what type will be used today)
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const [userRows] = await pool.query(
      'SELECT contribution_mode FROM subscribers WHERE userId = ?',
      [req.user.id]
    );
    
    const userSettings = userRows[0] || { contribution_mode: 'auto' };
    const contributionType = getContributionType(userSettings);
    const dayOfMonth = new Date().getDate();

    res.json({
      status: 'success',
      data: {
        type: contributionType,
        mode: userSettings.contribution_mode,
        dayOfMonth,
        description: contributionType === 'ICA' 
          ? 'Investment Cooperative Account - Yearly commitment with interest'
          : 'Piggy Savings - Monthly savings in your wallet'
      }
    });
  } catch (err) {
    console.error('Get contribution info error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get contribution info' });
  }
});

// Get user's contribution history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [contributions] = await pool.query(
      'SELECT * FROM contributions WHERE userId = ? ORDER BY createdAt DESC',
      [req.user.id]
    );

    res.json({
      status: 'success',
      data: contributions
    });
  } catch (err) {
    console.error('Get contribution history error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get contribution history' });
  }
});

// Update contribution mode (user settings)
router.patch('/settings', authenticateToken, async (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!['auto', 'all_ica'].includes(mode)) {
      return res.status(400).json({ status: 'error', message: 'Invalid mode. Use "auto" or "all_ica"' });
    }

    await pool.query(
      'UPDATE subscribers SET contribution_mode = ? WHERE userId = ?',
      [mode, req.user.id]
    );

    res.json({
      status: 'success',
      message: 'Contribution mode updated',
      data: { mode }
    });
  } catch (err) {
    console.error('Update contribution mode error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update contribution mode' });
  }
});

module.exports = router;
