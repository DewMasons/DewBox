const db = require('../db');

class Coop {
  static async create(coopData) {
    const {
      coop_id, type, coop_name, coop_contact_name, contact_phoneno,
      coop_adress_line1, coop_adress_line2, city, state, country,
      state_registration, purpose, motto, subscription
    } = coopData;

    await db.query(
      `INSERT INTO coop 
      (coop_id, type, coop_name, coop_contact_name, contact_phoneno,
       coop_adress_line1, coop_adress_line2, city, state, \`state_registration#\`,
       purpose, motto, country, subscription)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [coop_id, type, coop_name, coop_contact_name, contact_phoneno,
       coop_adress_line1, coop_adress_line2, city, state, state_registration,
       purpose, motto, country, subscription]
    );

    return this.findById(coop_id);
  }

  static async findById(coopId) {
    const [rows] = await db.query('SELECT * FROM coop WHERE coop_id = ?', [coopId]);
    return rows[0];
  }

  static async findByName(coopName) {
    const [rows] = await db.query('SELECT * FROM coop WHERE coop_name LIKE ?', [`%${coopName}%`]);
    return rows;
  }

  static async update(coopId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE coop SET ${setClause} WHERE coop_id = ?`,
      [...values, coopId]
    );

    return this.findById(coopId);
  }

  static async delete(coopId) {
    await db.query('DELETE FROM coop WHERE coop_id = ?', [coopId]);
  }

  static async getAll(limit = 100, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM coop LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

module.exports = Coop;
