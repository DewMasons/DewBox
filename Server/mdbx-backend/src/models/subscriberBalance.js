const db = require('../db');

class SubscriberBalance {
  static async create(subscriberId) {
    const [result] = await db.query(
      `INSERT INTO subscriber_balance 
      (subscriber_id, mtd_contributed, ytd_contributed, available_balance, 
       mtd_wallets, mtd_wallets_copy1, mtd_esusu, ytd_esusu, 
       mtd_purchases, ytd_purchases)
      VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, 0)`,
      [subscriberId]
    );
    return result.insertId;
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM subscriber_balance WHERE subscriber_id = ?',
      [subscriberId]
    );
    return rows[0];
  }

  static async updateBalance(subscriberId, balanceData) {
    const fields = Object.keys(balanceData);
    const values = Object.values(balanceData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE subscriber_balance SET ${setClause} WHERE subscriber_id = ?`,
      [...values, subscriberId]
    );

    return this.findBySubscriberId(subscriberId);
  }

  static async incrementBalance(subscriberId, amount, type = 'available_balance') {
    await db.query(
      `UPDATE subscriber_balance SET ${type} = ${type} + ? WHERE subscriber_id = ?`,
      [amount, subscriberId]
    );
    return this.findBySubscriberId(subscriberId);
  }

  static async decrementBalance(subscriberId, amount, type = 'available_balance') {
    await db.query(
      `UPDATE subscriber_balance SET ${type} = ${type} - ? WHERE subscriber_id = ?`,
      [amount, subscriberId]
    );
    return this.findBySubscriberId(subscriberId);
  }
}

module.exports = SubscriberBalance;
