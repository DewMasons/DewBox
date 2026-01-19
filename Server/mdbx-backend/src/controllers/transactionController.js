const Transaction = require('../models/transaction');

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const { type, amount, currency, userId } = req.body;

      if (!type || !amount || !currency || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const transaction = await Transaction.create({
        type,
        amount,
        currency,
        userId,
        status: 'pending'
      });

      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }

  static async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  }

  static async getUserTransactions(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const transactions = await Transaction.findByUserId(userId, parseInt(limit), parseInt(offset));

      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error('Get user transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  static async updateTransactionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const transaction = await Transaction.updateStatus(id, status);

      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error('Update transaction status error:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }

  static async getAllTransactions(req, res) {
    try {
      const { type, status, userId, limit = 100, offset = 0 } = req.query;

      const filters = {};
      if (type) filters.type = type;
      if (status) filters.status = status;
      if (userId) filters.userId = userId;

      const transactions = await Transaction.getAll(filters, parseInt(limit), parseInt(offset));

      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error('Get all transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  static async getTransactionStats(req, res) {
    try {
      const { userId } = req.params;
      const stats = await Transaction.getStatsByUserId(userId);

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Get transaction stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

module.exports = TransactionController;
