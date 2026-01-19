const db = require('../db');

class CoopMember {
  static async create(memberData) {
    const {
      coop_id, membership_serial, membership_officialid, member_name,
      member_phoneno, subscription_ytd, coop_loan_collected, coop_loan_repayment,
      coop_loan_repaid, coop_investment, coop_investment_yield,
      coop_investment_payback, coop_mdbx_subscriber_id, date_loan_disbursed,
      date_loan_matures, loan_repayment_frequency, date_investment_begins,
      date_investment_matures, investment_repayment_frequency
    } = memberData;

    await db.query(
      `INSERT INTO coop_members 
      (coop_id, \`membership_serial#\`, membership_officialid, member_name,
       member_phoneno, subscription_ytd, coop_loan_collected, coop_loan_repayment,
       coop_loan_repaid, coop_investment, coop_investment_yield,
       coop_investment_payback, coop_mdbx_subscriber_id, date_loan_disbursed,
       date_loan_matures, loan_repayment_frequency, date_investment_begins,
       date_investment_matures, investment_repayment_frequency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [coop_id, membership_serial, membership_officialid, member_name,
       member_phoneno, subscription_ytd, coop_loan_collected, coop_loan_repayment,
       coop_loan_repaid, coop_investment, coop_investment_yield,
       coop_investment_payback, coop_mdbx_subscriber_id, date_loan_disbursed,
       date_loan_matures, loan_repayment_frequency, date_investment_begins,
       date_investment_matures, investment_repayment_frequency]
    );

    return this.findByCoopId(coop_id);
  }

  static async findByCoopId(coopId) {
    const [rows] = await db.query(
      'SELECT * FROM coop_members WHERE coop_id = ?',
      [coopId]
    );
    return rows;
  }

  static async findBySubscriberId(subscriberId) {
    const [rows] = await db.query(
      'SELECT * FROM coop_members WHERE coop_mdbx_subscriber_id = ?',
      [subscriberId]
    );
    return rows;
  }

  static async update(coopId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE coop_members SET ${setClause} WHERE coop_id = ?`,
      [...values, coopId]
    );

    return this.findByCoopId(coopId);
  }

  static async delete(coopId) {
    await db.query('DELETE FROM coop_members WHERE coop_id = ?', [coopId]);
  }
}

module.exports = CoopMember;
