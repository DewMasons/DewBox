const db = require('../db');
const { v4: uuidv4 } = require('uuid');

class Contribution {
  static async create(contributionData) {
    const { 
      userId, 
      type, // 'PIGGY', 'ICA', or 'FEE'
      amount, 
      status = 'completed',
      description,
      year,
      month
    } = contributionData;
    
    const id = uuidv4();
    const contribution_date = new Date();

    await db.query(
      `INSERT INTO contributions 
      (id, userId, type, amount, status, contribution_date, year, month, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(6), NOW(6))`,
      [id, userId, type, amount, status, contribution_date, year, month, description]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM contributions WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT * FROM contributions 
       WHERE userId = ? 
       ORDER BY createdAt DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async findByType(userId, type, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT * FROM contributions 
       WHERE userId = ? AND type = ?
       ORDER BY createdAt DESC 
       LIMIT ? OFFSET ?`,
      [userId, type, limit, offset]
    );
    return rows;
  }

  static async getUserSummary(userId) {
    const [rows] = await db.query(
      `SELECT 
        type,
        COUNT(*) as count,
        SUM(amount) as total,
        SUM(CASE WHEN YEAR(createdAt) = YEAR(NOW()) THEN amount ELSE 0 END) as ytd,
        SUM(CASE WHEN YEAR(createdAt) = YEAR(NOW()) AND MONTH(createdAt) = MONTH(NOW()) THEN amount ELSE 0 END) as mtd
       FROM contributions 
       WHERE userId = ? AND status = 'completed'
       GROUP BY type`,
      [userId]
    );
    return rows;
  }

  static async getMonthlyBreakdown(userId, year) {
    const [rows] = await db.query(
      `SELECT 
        month,
        type,
        SUM(amount) as total
       FROM contributions 
       WHERE userId = ? AND year = ? AND status = 'completed'
       GROUP BY month, type
       ORDER BY month, type`,
      [userId, year]
    );
    return rows;
  }

  static async getTotalByType(type, year = null, month = null) {
    let query = `SELECT SUM(amount) as total FROM contributions WHERE type = ? AND status = 'completed'`;
    const params = [type];

    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    if (month) {
      query += ' AND month = ?';
      params.push(month);
    }

    const [rows] = await db.query(query, params);
    return rows[0]?.total || 0;
  }

  static async updateInterest(id, interestAmount) {
    await db.query(
      'UPDATE contributions SET interest_earned = ? WHERE id = ?',
      [interestAmount, id]
    );
    return this.findById(id);
  }

  static async getICAContributions(userId) {
    const [rows] = await db.query(
      `SELECT * FROM contributions 
       WHERE userId = ? AND type = 'ICA' AND status = 'completed'
       ORDER BY createdAt DESC`,
      [userId]
    );
    return rows;
  }

  static async getPiggyContributions(userId) {
    const [rows] = await db.query(
      `SELECT * FROM contributions 
       WHERE userId = ? AND type = 'PIGGY' AND status = 'completed'
       ORDER BY createdAt DESC`,
      [userId]
    );
    return rows;
  }

  static async getFeeContributions(userId) {
    const [rows] = await db.query(
      `SELECT * FROM contributions 
       WHERE userId = ? AND type = 'FEE' AND status = 'completed'
       ORDER BY createdAt DESC`,
      [userId]
    );
    return rows;
  }

  static async getAllContributions(filters = {}, limit = 100, offset = 0) {
    let query = 'SELECT c.*, u.name, u.email FROM contributions c LEFT JOIN user u ON c.userId = u.id WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND c.type = ?';
      params.push(filters.type);
    }

    if (filters.status) {
      query += ' AND c.status = ?';
      params.push(filters.status);
    }

    if (filters.year) {
      query += ' AND c.year = ?';
      params.push(filters.year);
    }

    if (filters.month) {
      query += ' AND c.month = ?';
      params.push(filters.month);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }
}

module.exports = Contribution;
