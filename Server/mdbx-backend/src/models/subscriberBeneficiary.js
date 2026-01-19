const db = require('../db');

class SubscriberBeneficiary {
  static async create(beneficiaryData) {
    const { subscriber_id, beneficiary_surname, percent_benefit } = beneficiaryData;

    const [result] = await db.query(
      `INSERT INTO subscriber_beneficiaries 
      (subscriber_id, beneficiary_surname, percent_benefit)
      VALUES (?, ?, ?)`,
      [subscriber_id, beneficiary_surname, percent_benefit]
    );

    return result.insertId;
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM subscriber_beneficiaries WHERE subscriber_id = ?',
      [subscriberId]
    );
    return rows;
  }

  static async update(subscriberId, serialNumber, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE subscriber_beneficiaries SET ${setClause} 
       WHERE subscriber_id = ? AND \`beneficiary_serial#\` = ?`,
      [...values, subscriberId, serialNumber]
    );
  }

  static async delete(subscriberId, serialNumber) {
    await db.query(
      'DELETE FROM subscriber_beneficiaries WHERE subscriber_id = ? AND `beneficiary_serial#` = ?',
      [subscriberId, serialNumber]
    );
  }
}

module.exports = SubscriberBeneficiary;
