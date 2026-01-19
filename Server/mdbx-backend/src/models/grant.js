const db = require('../db');

class Grant {
  static async create(grantData) {
    const {
      grants_year, cashgrant_01, cashgrant_02, cashgrant_03, cashgrant_04,
      grant_egfed, cash01_year_limit, cash02_year_limit, cash03_year_limit,
      cash04_year_limit, egfed_year_limit
    } = grantData;

    await db.query(
      `INSERT INTO grants_yearly 
      (grants_year, cashgrant_01, cashgrant_02, cashgrant_03, cashgrant_04,
       grant_egfed, cash01_year_limit, cash02_year_limit, cash03_year_limit,
       cash04_year_limit, egfed_year_limit, cash01_ytdno_given, cash02_ytdno_given,
       cash03_ytdno_given, cash04_ytdno_given, egfed_ytdno_given)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0)`,
      [grants_year, cashgrant_01, cashgrant_02, cashgrant_03, cashgrant_04,
       grant_egfed, cash01_year_limit, cash02_year_limit, cash03_year_limit,
       cash04_year_limit, egfed_year_limit]
    );

    return this.findByYear(grants_year);
  }

  static async findByYear(year) {
    const [rows] = await db.query(
      'SELECT * FROM grants_yearly WHERE grants_year = ?',
      [year]
    );
    return rows[0];
  }

  static async update(year, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE grants_yearly SET ${setClause} WHERE grants_year = ?`,
      [...values, year]
    );

    return this.findByYear(year);
  }

  static async incrementGrantGiven(year, grantType) {
    const field = `${grantType}_ytdno_given`;
    await db.query(
      `UPDATE grants_yearly SET ${field} = ${field} + 1 WHERE grants_year = ?`,
      [year]
    );
    return this.findByYear(year);
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM grants_yearly ORDER BY grants_year DESC');
    return rows;
  }
}

module.exports = Grant;
