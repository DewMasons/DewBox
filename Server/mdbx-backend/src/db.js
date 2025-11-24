const mysql = require('mysql2/promise');
require('dotenv').config();

function stripQuotes(str) {
  if (!str) return str;
  return str.replace(/^"(.*)"$/, '$1');
}

// Database configuration with Railway support
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: stripQuotes(process.env.MYSQLUSER || process.env.DB_USERNAME),
  password: stripQuotes(process.env.MYSQLPASSWORD || process.env.DB_PASSWORD),
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Add SSL configuration for Railway and other cloud providers
if (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')) {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('🔌 Database pool created successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error creating database pool:', err.message);
  });

module.exports = pool;
