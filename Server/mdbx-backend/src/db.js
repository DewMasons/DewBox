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
  connectionLimit: 5, // Reduced from 10 for Railway free tier
  queueLimit: 0,
  // Add connection timeout and keep-alive settings for Railway
  connectTimeout: 30000, // 30 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  // Add these for better connection management
  maxIdle: 5, // Maximum idle connections
  idleTimeout: 60000, // Close idle connections after 60 seconds
};

// Add SSL configuration for Railway and other cloud providers
if (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')) {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(dbConfig);

// Add error handler for pool
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Database connection lost, pool will reconnect automatically');
  }
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('🔌 Database pool created successfully');
    console.log('📊 Pool config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit
    });
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error creating database pool:', err.message);
  });

module.exports = pool;
