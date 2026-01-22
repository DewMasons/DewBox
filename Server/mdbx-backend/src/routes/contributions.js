const express = require('express');
const authenticateToken = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Determine contribution type based on user's registration date and settings
const getContributionType = (userSettings, registrationDate) => {
  const today = new Date();
  const regDate = new Date(registrationDate);
  
  // If user has "all_ica" mode, always return ICA
  if (userSettings.contribution_mode === 'all_ica') {
    return 'ICA';
  }
  
  // Calculate days since registration in current month cycle
  const regDay = regDate.getDate();
  const currentDay = today.getDate();
  
  // Calculate the user's personal month cycle
  // ICA period: registration day to (registration day + 9)
  // PIGGY period: (registration day + 10) to end of cycle
  
  let icaStartDay = regDay;
  let icaEndDay = regDay + 9;
  
  // Normalize for month boundaries
  if (icaEndDay > 31) {
    icaEndDay = icaEndDay - 31;
  }
  
  // Check if today falls in ICA period
  if (icaStartDay <= icaEndDay) {
    // Normal case: ICA period doesn't wrap around month
    if (currentDay >= icaStartDay && currentDay <= icaEndDay) {
      return 'ICA';
    }
  } else {
    // Wrapped case: ICA period crosses month boundary
    if (currentDay >= icaStartDay || currentDay <= icaEndDay) {
      return 'ICA';
    }
  }
  
  // Otherwise, it's PIGGY period
  return 'PIGGY';
};

// Create contribution
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, description, type, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    if (!paymentMethod || !['wallet', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ status: 'error', message: 'Valid payment method is required (wallet or bank)' });
    }

    // Get user info and settings
    const [userRows] = await pool.query(
      'SELECT u.*, s.contribution_mode, s.ica_balance, s.piggy_balance, s.createdAt as registrationDate FROM user u LEFT JOIN subscribers s ON u.subscriber_id = s.id WHERE u.id = ?',
      [req.user.id]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    const user = userRows[0];
    const contributionType = type ? type.toUpperCase() : getContributionType(user, user.registrationDate || user.createdAt);
    
    // If bank payment, initialize Paystack
    if (paymentMethod === 'bank') {
      const axios = require('axios');
      const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/contribute?status=success&type=${contributionType}`;
      
      try {
        const paystackResponse = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: user.email,
            amount: parseFloat(amount) * 100, // Convert to kobo
            callback_url: callbackUrl,
            metadata: {
              userId: req.user.id,
              contributionType: contributionType,
              paymentMethod: 'bank',
              description: description || `${contributionType} Contribution`,
              custom_fields: [
                {
                  display_name: "User ID",
                  variable_name: "user_id",
                  value: req.user.id
                },
                {
                  display_name: "Contribution Type",
                  variable_name: "contribution_type",
                  value: contributionType
                }
              ]
            },
            channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (paystackResponse.data.status) {
          // Create pending transaction record
          await pool.query(
            `INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) 
             VALUES (UUID(), ?, ?, 'NGN', 'pending', ?, NOW(6))`,
            ['contribution', amount, req.user.id]
          );

          return res.json({
            status: 'success',
            message: 'Payment initialized',
            data: {
              authorization_url: paystackResponse.data.data.authorization_url,
              reference: paystackResponse.data.data.reference,
              access_code: paystackResponse.data.data.access_code,
              contributionType: contributionType
            }
          });
        }
      } catch (paystackError) {
        console.error('Paystack initialization error:', paystackError.response?.data || paystackError.message);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Failed to initialize payment', 
          error: paystackError.response?.data?.message || paystackError.message 
        });
      }
    }

    // Wallet payment - existing logic
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
        ['contribution', amount, req.user.id]
      );

      await pool.query('COMMIT');

      res.json({
        status: 'success',
        message: `${contributionType} contribution successful`,
        data: {
          type: contributionType,
          amount: parseFloat(amount),
          description: contributionType === 'ICA' ? 'Investment Cooperative Account - Join an investment cooperative group. Rotating collection' : 'Piggy Savings - Flexible savings in your wallet',
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
      'SELECT s.contribution_mode, s.createdAt as registrationDate, u.createdAt as userCreatedAt FROM subscribers s LEFT JOIN user u ON s.userId = u.id WHERE s.userId = ?',
      [req.user.id]
    );
    
    const userSettings = userRows[0] || { contribution_mode: 'auto' };
    const registrationDate = userSettings.registrationDate || userSettings.userCreatedAt || new Date();
    const contributionType = getContributionType(userSettings, registrationDate);
    const dayOfMonth = new Date().getDate();
    const regDay = new Date(registrationDate).getDate();
    
    // Calculate ICA period for this user
    const icaStartDay = regDay;
    const icaEndDay = (regDay + 9) > 31 ? (regDay + 9 - 31) : (regDay + 9);

    res.json({
      status: 'success',
      data: {
        type: contributionType,
        mode: userSettings.contribution_mode,
        dayOfMonth,
        registrationDay: regDay,
        icaPeriod: `Day ${icaStartDay} to Day ${icaEndDay}`,
        piggyPeriod: `Day ${icaEndDay + 1} to Day ${icaStartDay - 1}`,
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

// Verify contribution payment from Paystack (no auth required for Paystack callbacks)
router.get('/verify/:reference', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { reference } = req.params;
    const axios = require('axios');
    
    console.log('[CONTRIBUTION VERIFY] ========================================');
    console.log('[CONTRIBUTION VERIFY] Verifying payment reference:', reference);
    console.log('[CONTRIBUTION VERIFY] Request headers:', req.headers);
    console.log('[CONTRIBUTION VERIFY] Request query:', req.query);
    
    // Verify payment with Paystack
    console.log('[CONTRIBUTION VERIFY] Calling Paystack API...');
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    console.log('[CONTRIBUTION VERIFY] Paystack response status:', response.data.status);
    console.log('[CONTRIBUTION VERIFY] Paystack transaction status:', response.data.data?.status);
    console.log('[CONTRIBUTION VERIFY] Paystack metadata:', response.data.data?.metadata);

    if (response.data.status && response.data.data.status === 'success') {
      const amount = response.data.data.amount / 100; // Convert from kobo
      const userId = response.data.data.metadata?.userId;
      const contributionType = response.data.data.metadata?.contributionType || 'PIGGY';
      
      console.log('[CONTRIBUTION VERIFY] Extracted data - Amount:', amount, 'UserId:', userId, 'Type:', contributionType);
      
      if (!userId) {
        console.log('[CONTRIBUTION VERIFY] ERROR: User ID not found in metadata');
        return res.status(400).json({ status: 'error', message: 'User ID not found in transaction metadata' });
      }

      // Get user info
      console.log('[CONTRIBUTION VERIFY] Fetching user info...');
      const [userRows] = await connection.query(
        'SELECT u.*, s.contribution_mode, s.ica_balance, s.piggy_balance FROM user u LEFT JOIN subscribers s ON u.subscriber_id = s.id WHERE u.id = ?',
        [userId]
      );
      
      if (userRows.length === 0) {
        console.log('[CONTRIBUTION VERIFY] ERROR: User not found');
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      console.log('[CONTRIBUTION VERIFY] User found:', userRows[0].email);

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      // Start transaction
      console.log('[CONTRIBUTION VERIFY] Starting database transaction...');
      await connection.beginTransaction();

      try {
        // Add funds to user wallet first
        console.log('[CONTRIBUTION VERIFY] Adding funds to wallet...');
        await connection.query(
          'UPDATE user SET balance = balance + ? WHERE id = ?',
          [amount, userId]
        );

        if (contributionType === 'ICA') {
          console.log('[CONTRIBUTION VERIFY] Processing ICA contribution...');
          // ICA: Transfer to admin wallet
          const adminId = process.env.ADMIN_USER_ID || 'admin';
          
          // Deduct from user wallet
          await connection.query(
            'UPDATE user SET balance = balance - ? WHERE id = ?',
            [amount, userId]
          );
          
          // Add to admin wallet
          await connection.query(
            'UPDATE user SET balance = balance + ? WHERE id = ?',
            [amount, adminId]
          );
          
          // Update user's ICA balance
          await connection.query(
            'UPDATE subscribers SET ica_balance = ica_balance + ? WHERE userId = ?',
            [amount, userId]
          );
        } else if (contributionType === 'PIGGY') {
          console.log('[CONTRIBUTION VERIFY] Processing PIGGY contribution...');
          // PIGGY: Money stays in user wallet, just track it
          await connection.query(
            'UPDATE subscribers SET piggy_balance = piggy_balance + ? WHERE userId = ?',
            [amount, userId]
          );
        } else if (contributionType === 'ESUSU') {
          console.log('[CONTRIBUTION VERIFY] Processing ESUSU contribution (coop system)...');
          // ESUSU: Handled by coop system - just record the transaction
          // The coop service will handle the actual contribution logic
        }

        // Record contribution
        console.log('[CONTRIBUTION VERIFY] Recording contribution...');
        await connection.query(
          `INSERT INTO contributions (id, userId, type, amount, contribution_date, year, month, createdAt) 
           VALUES (UUID(), ?, ?, ?, CURDATE(), ?, ?, NOW(6))`,
          [userId, contributionType, amount, year, month]
        );

        // Record in transactions table
        console.log('[CONTRIBUTION VERIFY] Recording transaction...');
        await connection.query(
          `INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) 
           VALUES (UUID(), ?, ?, 'NGN', 'completed', ?, NOW(6))`,
          ['contribution', amount, userId]
        );

        await connection.commit();
        console.log('[CONTRIBUTION VERIFY] Transaction committed successfully!');

        console.log('[CONTRIBUTION VERIFY] SUCCESS - Contribution processed for user:', userId, 'Amount:', amount, 'Type:', contributionType);
        console.log('[CONTRIBUTION VERIFY] ========================================');

        return res.json({
          status: 'success',
          message: `${contributionType} contribution verified successfully`,
          data: { 
            amount, 
            reference, 
            userId,
            contributionType,
            year,
            month
          }
        });
      } catch (dbErr) {
        await connection.rollback();
        console.log('[CONTRIBUTION VERIFY] ERROR: Database error, rolling back:', dbErr);
        throw dbErr;
      }
    }

    console.log('[CONTRIBUTION VERIFY] ERROR: Payment verification failed - status not success');
    res.status(400).json({ status: 'error', message: 'Payment verification failed' });
  } catch (err) {
    console.error('[CONTRIBUTION VERIFY] ERROR: Payment verification error:', err);
    console.error('[CONTRIBUTION VERIFY] Error stack:', err.stack);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to verify payment', 
      error: err.message,
      details: err.response?.data || null
    });
  } finally {
    connection.release();
    console.log('[CONTRIBUTION VERIFY] Connection released');
  }
});

module.exports = router;
