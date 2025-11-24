const mysql = require('mysql2/promise');
require('dotenv').config();

function stripQuotes(str) {
  if (!str) return str;
  return str.replace(/^"(.*)"$/, '$1');
}

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || 3306,
  user: stripQuotes(process.env.MYSQLUSER || process.env.DB_USERNAME),
  password: stripQuotes(process.env.MYSQLPASSWORD || process.env.DB_PASSWORD),
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
