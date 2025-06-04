const mysql = require('mysql2/promise');
require('dotenv').config();

function stripQuotes(str) {
  if (!str) return str;
  return str.replace(/^"(.*)"$/, '$1');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: stripQuotes(process.env.DB_USERNAME),
  password: stripQuotes(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
