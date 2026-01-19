const db = require('../db');

class YearlySummary {
  static async create(summaryData) {
    const {
      year, subscriber_id, piggy = 0, ica = 0, wallets = 0,
      purchases = 0, loans = 0, coop_esusu = 0, coop_external = 0
    } = summaryData;

    await db.query(
      `INSERT INTO yearly_summary 
      (year, subscriber_id, piggy, ica, wallets, purchases, loans, coop_esusu, coop_external)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [year, subscriber_id, piggy, ica, wallets, purchases, loans, coop_esusu, coop_external]
    );

    return this.findByYearAndSubscriber(year, subscriber_id);
  }

  static async findByYearAndSubscriber(year, subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM yearly_summary WHERE year = ? AND subscriber_id = ?',
      [year, subscriberId]
    );
    return rows[0];
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM yearly_summary WHERE subscriber_id = ? ORDER BY year DESC',
      [subscriberId]
    );
    return rows;
  }

  static async update(year, subscriberId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE yearly_summary SET ${setClause} WHERE year = ? AND subscriber_id = ?`,
      [...values, year, subscriberId]
    );

    return this.findByYearAndSubscriber(year, subscriberId);
  }

  static async incrementField(year, subscriberId, field, amount) {
    await db.query(
      `UPDATE yearly_summary SET ${field} = ${field} + ? 
       WHERE year = ? AND subscriber_id = ?`,
      [amount, year, subscriberId]
    );
    return this.findByYearAndSubscriber(year, subscriberId);
  }
}

module.exports = YearlySummary;
