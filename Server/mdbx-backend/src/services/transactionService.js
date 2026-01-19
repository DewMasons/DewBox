const Transaction = require('../models/transaction');
const TransactionMdbx = require('../models/transactionMdbx');
const SubscriberBalance = require('../models/subscriberBalance');
const YearlySummary = require('../models/yearlySummary');

class TransactionService {
  static async processContribution(userId, subscriberId, amount, currency) {
    try {
      // Create transaction record
      const transaction = await Transaction.create({
        type: 'contribution',
        amount,
        currency,
        userId,
        status: 'pending'
      });

      // Update subscriber balance
      await SubscriberBalance.incrementBalance(subscriberId, amount, 'available_balance');
      await SubscriberBalance.incrementBalance(subscriberId, amount, 'mtd_contributed');
      await SubscriberBalance.incrementBalance(subscriberId, amount, 'ytd_contributed');

      // Update yearly summary
      const currentYear = new Date().getFullYear();
      const summary = await YearlySummary.findByYearAndSubscriber(currentYear, subscriberId);
      
      if (summary) {
        await YearlySummary.incrementField(currentYear, subscriberId, 'piggy', amount);
      } else {
        await YearlySummary.create({
          year: currentYear,
          subscriber_id: subscriberId,
          piggy: amount
        });
      }

      // Update transaction status
      await Transaction.updateStatus(transaction.id, 'completed');

      return { success: true, transaction };
    } catch (error) {
      console.error('Process contribution error:', error);
      throw error;
    }
  }

  static async processWithdrawal(userId, subscriberId, amount, currency) {
    try {
      // Check balance
      const balance = await SubscriberBalance.findBySubscriberId(subscriberId);
      
      if (!balance || balance.available_balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Create transaction record
      const transaction = await Transaction.create({
        type: 'withdrawal',
        amount,
        currency,
        userId,
        status: 'pending'
      });

      // Update subscriber balance
      await SubscriberBalance.decrementBalance(subscriberId, amount, 'available_balance');

      // Update transaction status
      await Transaction.updateStatus(transaction.id, 'completed');

      return { success: true, transaction };
    } catch (error) {
      console.error('Process withdrawal error:', error);
      throw error;
    }
  }

  static async getTransactionSummary(subscriberId) {
    try {
      const balance = await SubscriberBalance.findBySubscriberId(subscriberId);
      const yearlyData = await YearlySummary.findBySubscriberId(subscriberId);

      return {
        balance,
        yearlyData
      };
    } catch (error) {
      console.error('Get transaction summary error:', error);
      throw error;
    }
  }

  static async recordMdbxTransaction(transactionData) {
    try {
      const transaction = await TransactionMdbx.create(transactionData);
      return transaction;
    } catch (error) {
      console.error('Record MDBX transaction error:', error);
      throw error;
    }
  }
}

module.exports = TransactionService;
