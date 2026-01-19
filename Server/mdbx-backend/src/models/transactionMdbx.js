const db = require('../db');

class TransactionMdbx {
  static async create(transactionData) {
    const {
      subscriber_id, lineno, date, service_channel_id,
      transaction_type_id, device_used_id, opening_balance, amount_transaction
    } = transactionData;

    await db.query(
      `INSERT INTO transactions_mdbx 
      (subscriber_id, lineno, date, timestamp, service_channel_id, 
       transaction_type_id, device_used_id, opening_balance, amount_transaction)
      VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [subscriber_id, lineno, date, service_channel_id, transaction_type_id,
       device_used_id, opening_balance, amount_transaction]
    );

    return this.findBySubscriberId(subscriber_id);
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM transactions_mdbx WHERE subscriber_id = ?',
      [subscriberId]
    );
    return rows;
  }

  static async getTransactionHistory(subscriberId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT tm.*, tt.transaction_type, sc.service_channel_description, dt.device_name
       FROM transactions_mdbx tm
       LEFT JOIN transaction_type tt ON tm.transaction_type_id = tt.transaction_type_id
       LEFT JOIN service_channels sc ON tm.service_channel_id = sc.service_channel_id
       LEFT JOIN device_used_type dt ON tm.device_used_id = dt.device_used_id
       WHERE tm.subscriber_id = ?
       ORDER BY tm.timestamp DESC
       LIMIT ? OFFSET ?`,
      [subscriberId, limit, offset]
    );
    return rows;
  }

  static async getAll(limit = 100, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM transactions_mdbx ORDER BY timestamp DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

module.exports = TransactionMdbx;
