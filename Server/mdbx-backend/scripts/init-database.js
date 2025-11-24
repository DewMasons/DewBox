require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  console.log('🔄 Initializing database...\n');
  
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USERNAME,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
      ssl: process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') ? { rejectUnauthorized: false } : undefined
    });

    console.log('✅ Connected to database\n');

    // Create users table
    console.log('📝 Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        mobile VARCHAR(20) UNIQUE,
        password VARCHAR(255),
        balance DECIMAL(10, 2) DEFAULT 0.00,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users table created\n');

    // Create user table (legacy compatibility)
    console.log('📝 Creating user table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        mobile VARCHAR(20) UNIQUE,
        password VARCHAR(255),
        balance DECIMAL(10, 2) DEFAULT 0.00,
        subscriber_id INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ user table created\n');

    // Create subscribers table
    console.log('📝 Creating subscribers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100),
        surname VARCHAR(100),
        othername VARCHAR(100),
        address1 VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        dob DATE,
        gender VARCHAR(20),
        mobile VARCHAR(20) UNIQUE,
        alternatePhone VARCHAR(20),
        currency VARCHAR(10),
        referral VARCHAR(255),
        referralPhone VARCHAR(20),
        nextOfKinName VARCHAR(255),
        nextOfKinContact VARCHAR(20),
        userId VARCHAR(36),
        password VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ subscribers table created\n');

    // Create transactions table
    console.log('📝 Creating transactions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        type ENUM('deposit', 'withdrawal', 'contribution', 'deposit_fee') NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        reference VARCHAR(255) UNIQUE,
        description TEXT,
        metadata JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ transactions table created\n');

    // Create contributions table
    console.log('📝 Creating contributions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        mode ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
        status ENUM('active', 'paused', 'cancelled') DEFAULT 'active',
        startDate DATE NOT NULL,
        nextDueDate DATE NOT NULL,
        totalPaid DECIMAL(10, 2) DEFAULT 0.00,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ contributions table created\n');

    console.log('🎉 Database initialization completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
