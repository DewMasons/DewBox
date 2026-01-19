const { Wallet, WalletPayment } = require('../models/wallet');
const SubscriberBalance = require('../models/subscriberBalance');

class WalletService {
  static async createWalletFromBalance(subscriberId, amount) {
    try {
      // Check if subscriber has sufficient balance
      const balance = await SubscriberBalance.findBySubscriberId(subscriberId);
      
      if (!balance || balance.available_balance < amount) {
        throw new Error('Insufficient balance to create wallet');
      }

      // Create wallet
      const wallet = await Wallet.create({
        subscriber_id: subscriberId,
        wallets_amount_created: amount
      });

      // Deduct from subscriber balance
      await SubscriberBalance.decrementBalance(subscriberId, amount, 'available_balance');
      await SubscriberBalance.incrementBalance(subscriberId, amount, 'mtd_wallets');

      return wallet;
    } catch (error) {
      console.error('Create wallet from balance error:', error);
      throw error;
    }
  }

  static async processWalletPayment(walletId, subscriberId, paymentData) {
    try {
      const { paid_invoice_ref, invoice_amount, amount_paid } = paymentData;

      // Get wallet
      const wallet = await Wallet.findBySubscriberId(subscriberId);
      
      if (!wallet || wallet.wallets_available_balance < amount_paid) {
        throw new Error('Insufficient wallet balance');
      }

      // Create payment record
      const payment = await WalletPayment.create({
        wallet_id: walletId,
        line_no: Date.now(), // Generate unique line number
        paid_invoice_ref,
        invoice_amount,
        amount_paid
      });

      // Update wallet balance
      await Wallet.updateBalance(subscriberId, amount_paid, 'subtract');

      return payment;
    } catch (error) {
      console.error('Process wallet payment error:', error);
      throw error;
    }
  }

  static async getWalletSummary(subscriberId) {
    try {
      const wallet = await Wallet.findBySubscriberId(subscriberId);
      
      if (!wallet) {
        return null;
      }

      const payments = await WalletPayment.findByWalletId(wallet.subscriber_id);

      return {
        wallet,
        payments,
        totalPayments: payments.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0)
      };
    } catch (error) {
      console.error('Get wallet summary error:', error);
      throw error;
    }
  }
}

module.exports = WalletService;
