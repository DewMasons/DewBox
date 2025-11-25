const express = require('express');
const authenticateToken = require('../middleware/auth');
const pool = require('../db');
const axios = require('axios');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all transactions for the user
    const [rows] = await pool.query(
      'SELECT * FROM transaction WHERE userId = ? ORDER BY createdAt DESC',
      [req.user.id]
    );
    res.json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch transactions', error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, amount, bank, account, password, message, accountName, bankCode, email, recipientEmail } = req.body;
    
    if (!type || !amount) {
      return res.status(400).json({ status: 'error', message: 'Type and amount are required' });
    }

    // Get user info
    const [userRows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.user.id]);
    if (userRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    const user = userRows[0];

    // Verify password for sensitive transactions (withdrawal, transfer)
    if (['withdrawal', 'transfer', 'wallet'].includes(type.toLowerCase())) {
      if (!password) {
        return res.status(400).json({ status: 'error', message: 'Password is required for this transaction' });
      }

      const bcrypt = require('bcrypt');
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid password' });
      }
    }

    // Handle different transaction types
    let transactionData = {
      id: null,
      type: type.toLowerCase(),
      amount: parseFloat(amount),
      status: 'pending',
      userId: req.user.id,
      metadata: {}
    };

    switch (type.toUpperCase()) {
      case 'CONTRIBUTION':
      case 'DEPOSIT':
      case 'FEE':
        // Initialize Paystack payment with user's email from database
        const isFee = type.toUpperCase() === 'FEE';
        const callbackUrl = isFee 
          ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?firstPayment=success`
          : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/transactions?status=success`;
        
        const paystackResponse = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: user.email,
            amount: parseFloat(amount) * 100, // Convert to kobo
            callback_url: callbackUrl,
            metadata: {
              userId: req.user.id,
              type: isFee ? 'fee' : 'deposit',
              custom_fields: [
                {
                  display_name: "User ID",
                  variable_name: "user_id",
                  value: req.user.id
                },
                {
                  display_name: "Transaction Type",
                  variable_name: "transaction_type",
                  value: isFee ? 'Subscription Fee' : 'Wallet Deposit'
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
          transactionData.metadata = {
            paystack_reference: paystackResponse.data.data.reference,
            authorization_url: paystackResponse.data.data.authorization_url
          };
          
          // Insert transaction with currency (default to NGN)
          const [result] = await pool.query(
            'INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(6))',
            [transactionData.type, transactionData.amount, 'NGN', transactionData.status, transactionData.userId]
          );

          return res.json({
            status: 'success',
            message: 'Payment initialized',
            data: {
              authorization_url: paystackResponse.data.data.authorization_url,
              reference: paystackResponse.data.data.reference,
              access_code: paystackResponse.data.data.access_code
            }
          });
        }
        break;

      case 'WITHDRAWAL':
      case 'TRANSFER':
        // Verify required fields
        if (!account || !bankCode || !accountName) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'Bank account details are required (account, bankCode, accountName)' 
          });
        }

        // Verify user has sufficient balance
        if (parseFloat(user.balance) < parseFloat(amount)) {
          return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
        }

        // Check if Paystack key is configured
        if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.includes('your_actual_live_key_here')) {
          return res.status(503).json({ 
            status: 'error', 
            message: 'Withdrawal service not configured. Please contact administrator.' 
          });
        }

        try {
          // Step 1: Create transfer recipient
          const recipientResponse = await axios.post(
            'https://api.paystack.co/transferrecipient',
            {
              type: 'nuban',
              name: accountName,
              account_number: account,
              bank_code: bankCode,
              currency: 'NGN'
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!recipientResponse.data.status) {
            return res.status(400).json({ 
              status: 'error', 
              message: 'Failed to create transfer recipient' 
            });
          }

          const recipientCode = recipientResponse.data.data.recipient_code;

          // Step 2: Initiate transfer
          const transferResponse = await axios.post(
            'https://api.paystack.co/transfer',
            {
              source: 'balance',
              amount: parseFloat(amount) * 100, // Convert to kobo
              recipient: recipientCode,
              reason: message || 'Withdrawal from MyDewbox',
              reference: `WD-${Date.now()}-${req.user.id.substring(0, 8)}`
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!transferResponse.data.status) {
            return res.status(400).json({ 
              status: 'error', 
              message: transferResponse.data.message || 'Transfer failed' 
            });
          }

          // Step 3: Record transaction
          transactionData.metadata = { 
            bank: bankCode, 
            account, 
            accountName,
            transfer_code: transferResponse.data.data.transfer_code,
            reference: transferResponse.data.data.reference
          };
          transactionData.status = 'completed';

          await pool.query(
            'INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(6))',
            [transactionData.type, transactionData.amount, 'NGN', transactionData.status, transactionData.userId]
          );

          // Step 4: Update user balance
          await pool.query(
            'UPDATE user SET balance = balance - ? WHERE id = ?',
            [transactionData.amount, req.user.id]
          );

          return res.json({
            status: 'success',
            message: 'Withdrawal successful. Funds will be credited to your account shortly.',
            data: {
              amount: transactionData.amount,
              account: account,
              accountName: accountName,
              reference: transferResponse.data.data.reference,
              status: transferResponse.data.data.status
            }
          });

        } catch (transferError) {
          console.error('Transfer error:', transferError.response?.data || transferError.message);
          
          // Handle specific Paystack errors
          if (transferError.response?.status === 401) {
            return res.status(401).json({ 
              status: 'error', 
              message: 'Invalid Paystack API key. Please contact administrator.' 
            });
          }
          
          if (transferError.response?.data?.message?.includes('Insufficient funds')) {
            return res.status(400).json({ 
              status: 'error', 
              message: 'Insufficient funds in payment provider account. Please contact support.' 
            });
          }

          if (transferError.response?.data?.code === 'transfer_unavailable') {
            return res.status(403).json({ 
              status: 'error', 
              message: 'Withdrawal service requires business verification. Please contact administrator to upgrade Paystack account.',
              code: 'business_upgrade_required'
            });
          }

          return res.status(500).json({ 
            status: 'error', 
            message: transferError.response?.data?.message || 'Withdrawal failed. Please try again.' 
          });
        }

      case 'WALLET':
        // Wallet to wallet transfer
        const [recipientRows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (recipientRows.length === 0) {
          return res.status(404).json({ status: 'error', message: 'Recipient not found' });
        }

        if (parseFloat(user.balance) < parseFloat(amount)) {
          return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
        }

        // Deduct from sender
        await pool.query('UPDATE user SET balance = balance - ? WHERE id = ?', [amount, req.user.id]);
        
        // Add to recipient
        await pool.query('UPDATE user SET balance = balance + ? WHERE id = ?', [amount, recipientRows[0].id]);

        // Record transaction with currency
        await pool.query(
          'INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(6))',
          ['wallet_transfer', amount, 'NGN', 'completed', req.user.id]
        );

        return res.json({
          status: 'success',
          message: 'Transfer completed',
          data: { recipient: email, amount, message }
        });

      default:
        return res.status(400).json({ status: 'error', message: 'Invalid transaction type' });
    }
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to create transaction', 
      error: err.response?.data?.message || err.message 
    });
  }
});

// Verify Paystack payment (can be called with or without auth for webhooks)
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    console.log('[VERIFY] Verifying payment reference:', reference);
    
    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    console.log('[VERIFY] Paystack response:', response.data);

    if (response.data.status && response.data.data.status === 'success') {
      const amount = response.data.data.amount / 100; // Convert from kobo
      const userId = response.data.data.metadata?.userId;
      
      if (!userId) {
        return res.status(400).json({ status: 'error', message: 'User ID not found in transaction metadata' });
      }

      // Check if already processed
      const [existing] = await pool.query(
        'SELECT * FROM transaction WHERE userId = ? AND status = ? ORDER BY createdAt DESC LIMIT 1',
        [userId, 'completed']
      );

      // Update user balance
      await pool.query(
        'UPDATE user SET balance = balance + ? WHERE id = ?',
        [amount, userId]
      );

      console.log('[VERIFY] Balance updated for user:', userId, 'Amount:', amount);

      return res.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: { amount, reference, userId }
      });
    }

    res.status(400).json({ status: 'error', message: 'Payment verification failed' });
  } catch (err) {
    console.error('[VERIFY] Payment verification error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to verify payment', 
      error: err.message 
    });
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
