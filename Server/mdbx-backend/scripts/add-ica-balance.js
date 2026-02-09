require('dotenv').config();
const mysql = require('mysql2/promise');

async function addICABalance() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to database\n');

    const email = 'hakeem.oludimu@gmail.com';
    const icaAmount = 2000;

    // Get user info
    const [userRows] = await connection.query(
      'SELECT u.id, u.email, u.mobile, s.id as subscriber_id, s.ica_balance FROM user u LEFT JOIN subscribers s ON u.subscriber_id = s.id WHERE u.email = ?',
      [email]
    );

    if (userRows.length === 0) {
      console.error('❌ User not found with email:', email);
      process.exit(1);
    }

    const user = userRows[0];
    console.log('📋 User Information:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Mobile:', user.mobile);
    console.log('   Current ICA Balance: ₦' + parseFloat(user.ica_balance || 0).toFixed(2));

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update ICA balance
      await connection.query(
        'UPDATE subscribers SET ica_balance = ica_balance + ? WHERE userId = ?',
        [icaAmount, user.id]
      );

      // Record contribution
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      await connection.query(
        `INSERT INTO contributions (id, userId, type, amount, contribution_date, year, month, createdAt) 
         VALUES (UUID(), ?, 'ICA', ?, CURDATE(), ?, ?, NOW(6))`,
        [user.id, icaAmount, year, month]
      );

      // Record transaction
      await connection.query(
        `INSERT INTO transaction (id, type, amount, currency, status, userId, createdAt) 
         VALUES (UUID(), 'contribution', ?, 'NGN', 'completed', ?, NOW(6))`,
        [icaAmount, user.id]
      );

      await connection.commit();

      // Get updated balance
      const [updatedRows] = await connection.query(
        'SELECT ica_balance FROM subscribers WHERE userId = ?',
        [user.id]
      );

      console.log('\n✅ ICA Balance Added Successfully!');
      console.log('   Amount Added: ₦' + icaAmount.toFixed(2));
      console.log('   New ICA Balance: ₦' + parseFloat(updatedRows[0].ica_balance).toFixed(2));
      console.log('   Contribution recorded for:', year + '/' + month);

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

addICABalance();
