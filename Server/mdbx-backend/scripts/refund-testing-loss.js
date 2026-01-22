require('dotenv').config();
const mysql = require('mysql2/promise');

async function refundTestingLoss() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to database');

    // The user ID from the logs
    const userId = '2540f1b4-c8d6-11f0-b5ad-a2aa676c5e24';
    const refundAmount = 300;

    // Get current user info
    const [userRows] = await connection.query(
      'SELECT id, email, mobile, balance FROM user WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      console.error('❌ User not found');
      process.exit(1);
    }

    const user = userRows[0];
    console.log('\n📋 User Information:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Mobile:', user.mobile);
    console.log('   Current Balance: ₦' + parseFloat(user.balance).toFixed(2));

    // Start transaction
    await connection.beginTransaction();

    try {
      // Add refund to user balance
      await connection.query(
        'UPDATE user SET balance = balance + ? WHERE id = ?',
        [refundAmount, userId]
      );

      // Record transaction as a contribution (deposit)
      await connection.query(
        `INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) 
         VALUES (UUID(), 'contribution', ?, 'NGN', 'completed', ?, NOW(6))`,
        [refundAmount, userId]
      );

      await connection.commit();

      // Get updated balance
      const [updatedRows] = await connection.query(
        'SELECT balance FROM user WHERE id = ?',
        [userId]
      );

      console.log('\n✅ Refund Successful!');
      console.log('   Amount Refunded: ₦' + refundAmount.toFixed(2));
      console.log('   New Balance: ₦' + parseFloat(updatedRows[0].balance).toFixed(2));
      console.log('   Reason: Testing loss compensation');

    } catch (err) {
      await connection.rollback();
      throw err;
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
refundTestingLoss();
