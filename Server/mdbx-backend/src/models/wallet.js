const db = require('../db');

class Wallet {
  static async create(walletData) {
    const { subscriber_id, wallets_amount_created } = walletData;

    await db.query(
      `INSERT INTO wallets_subscribers 
      (subscriber_id, wallets_amount_created, wallets_available_balance)
      VALUES (?, ?, ?)`,
      [subscriber_id, wallets_amount_created, wallets_amount_created]
    );

    return this.findBySubscriberId(subscriber_id);
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM wallets_subscribers WHERE subscriber_id = ?',
      [subscriberId]
    );
    return rows[0];
  }

  static async updateBalance(subscriberId, amount, operation = 'add') {
    const operator = operation === 'add' ? '+' : '-';
    
    await db.query(
      `UPDATE wallets_subscribers 
       SET wallets_available_balance = wallets_available_balance ${operator} ?
       WHERE subscriber_id = ?`,
      [amount, subscriberId]
    );

    return this.findBySubscriberId(subscriberId);
  }

  static async getAll(limit = 100, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM wallets_subscribers LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

class WalletPayment {
  static async create(paymentData) {
    const { wallet_id, line_no, paid_invoice_ref, invoice_amount, amount_paid } = paymentData;

    await db.query(
      `INSERT INTO wallets_pay 
      (wallet_id, line_no, paid_invoice_ref, invoice_amount, amount_paid)
      VALUES (?, ?, ?, ?, ?)`,
      [wallet_id, line_no, paid_invoice_ref, invoice_amount, amount_paid]
    );

    return this.findByWalletId(wallet_id);
  }

  static async findByWalletId(walletId) {
    const [rows] = await db.query(
      'SELECT * FROM wallets_pay WHERE wallet_id = ?',
      [walletId]
    );
    return rows;
  }
}

module.exports = { Wallet, WalletPayment };
