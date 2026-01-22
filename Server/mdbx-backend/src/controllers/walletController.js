const { Wallet, WalletPayment } = require('../models/wallet');
const pool = require('../db');

class WalletController {
  static async getMyWallet(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user's subscriber info and balance
      const [userRows] = await pool.query(
        'SELECT u.balance, s.id as subscriber_id FROM user u LEFT JOIN subscribers s ON u.subscriber_id = s.id WHERE u.id = ?',
        [userId]
      );
      
      if (userRows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      
      const user = userRows[0];
      
      res.json({
        status: 'success',
        data: {
          wallet: {
            balance: parseFloat(user.balance) || 0,
            subscriberId: user.subscriber_id
          }
        }
      });
    } catch (err) {
      console.error('Get my wallet error:', err);
      res.status(500).json({ status: 'error', message: 'Failed to get wallet' });
    }
  }

  static async createWallet(req, res) {
    try {
      const { subscriber_id, wallets_amount_created } = req.body;

      if (!subscriber_id || !wallets_amount_created) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const wallet = await Wallet.create({ subscriber_id, wallets_amount_created });

      res.status(201).json({ success: true, data: wallet });
    } catch (error) {
      console.error('Create wallet error:', error);
      res.status(500).json({ error: 'Failed to create wallet' });
    }
  }

  static async getWallet(req, res) {
    try {
      const { subscriberId } = req.params;
      const wallet = await Wallet.findBySubscriberId(subscriberId);

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.json({ success: true, data: wallet });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  }

  static async updateWalletBalance(req, res) {
    try {
      const { subscriberId } = req.params;
      const { amount, operation = 'add' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const wallet = await Wallet.updateBalance(subscriberId, amount, operation);

      res.json({ success: true, data: wallet });
    } catch (error) {
      console.error('Update wallet balance error:', error);
      res.status(500).json({ error: 'Failed to update wallet balance' });
    }
  }

  static async getAllWallets(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const wallets = await Wallet.getAll(parseInt(limit), parseInt(offset));

      res.json({ success: true, data: wallets });
    } catch (error) {
      console.error('Get all wallets error:', error);
      res.status(500).json({ error: 'Failed to fetch wallets' });
    }
  }

  // Wallet Payments
  static async createWalletPayment(req, res) {
    try {
      const paymentData = req.body;

      if (!paymentData.wallet_id || !paymentData.line_no) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const payment = await WalletPayment.create(paymentData);

      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      console.error('Create wallet payment error:', error);
      res.status(500).json({ error: 'Failed to create wallet payment' });
    }
  }

  static async getWalletPayments(req, res) {
    try {
      const { walletId } = req.params;
      const payments = await WalletPayment.findByWalletId(walletId);

      res.json({ success: true, data: payments });
    } catch (error) {
      console.error('Get wallet payments error:', error);
      res.status(500).json({ error: 'Failed to fetch wallet payments' });
    }
  }
}

module.exports = WalletController;
