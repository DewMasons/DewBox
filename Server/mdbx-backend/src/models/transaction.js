const db = require('../db');
const { v4: uuidv4 } = require('uuid');

class Transaction {
  static async create(transactionData) {
    const { type, amount, currency, status = 'pending', userId } = transactionData;
    const id = uuidv4();

    await db.query(
      `INSERT INTO transaction (id, type, amount, currency, status, userId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, type, amount, currency, status, userId]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM transaction WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT * FROM transaction WHERE userId = ? 
       ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await db.query(
      'UPDATE transaction SET status = ? WHERE id = ?',
      [status, id]
    );
    return this.findById(id);
  }

  static async getAll(filters = {}, limit = 100, offset = 0) {
    let query = 'SELECT * FROM transaction WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.userId) {
      query += ' AND userId = ?';
      params.push(filters.userId);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getStatsByUserId(userId) {
    const [rows] = await db.query(
      `SELECT 
        type,
        status,
        COUNT(*) as count,
        SUM(amount) as total
       FROM transaction 
       WHERE userId = ?
       GROUP BY type, status`,
      [userId]
    );
    return rows;
  }
}

module.exports = Transaction;
