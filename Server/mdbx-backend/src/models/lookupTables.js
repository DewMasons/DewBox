const db = require('../db');

// Coop Types
class CoopType {
  static async create(typeData) {
    const { coop_type_id, coop_type_description } = typeData;
    await db.query(
      'INSERT INTO coop_types (coop_type_id, coop_type_description) VALUES (?, ?)',
      [coop_type_id, coop_type_description]
    );
    return this.findById(coop_type_id);
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM coop_types WHERE coop_type_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM coop_types');
    return rows;
  }
}

// Transaction Types
class TransactionType {
  static async create(typeData) {
    const { transaction_type_id, transaction_type } = typeData;
    await db.query(
      'INSERT INTO transaction_type (transaction_type_id, transaction_type) VALUES (?, ?)',
      [transaction_type_id, transaction_type]
    );
    return this.findById(transaction_type_id);
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM transaction_type WHERE transaction_type_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM transaction_type');
    return rows;
  }
}

// Device Types
class DeviceType {
  static async create(deviceData) {
    const { device_used_id, device_name } = deviceData;
    await db.query(
      'INSERT INTO device_used_type (device_used_id, device_name) VALUES (?, ?)',
      [device_used_id, device_name]
    );
    return this.findById(device_used_id);
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM device_used_type WHERE device_used_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM device_used_type');
    return rows;
  }
}

// Service Channels
class ServiceChannel {
  static async create(channelData) {
    const { service_channel_id, service_channel_description } = channelData;
    await db.query(
      `INSERT INTO service_channels 
      (service_channel_id, service_channel_description, service_channel_ytdno, 
       service_channel_ytdamount, service_channel_mtdno, service_channel_mtdamount)
      VALUES (?, ?, 0, 0, 0, 0)`,
      [service_channel_id, service_channel_description]
    );
    return this.findById(service_channel_id);
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM service_channels WHERE service_channel_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM service_channels');
    return rows;
  }

  static async updateStats(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.query(
      `UPDATE service_channels SET ${setClause} WHERE service_channel_id = ?`,
      [...values, id]
    );
    return this.findById(id);
  }
}

module.exports = {
  CoopType,
  TransactionType,
  DeviceType,
  ServiceChannel
};
