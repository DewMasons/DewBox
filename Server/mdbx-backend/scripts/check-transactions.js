require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTransactions() {
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

    const userId = '2540f1b4-c8d6-11f0-b5ad-a2aa676c5e24';

    // Get transactions
    const [transactions] = await connection.query(
      'SELECT id, type, amount, currency, status, createdAt FROM transaction WHERE userId = ? ORDER BY createdAt DESC LIMIT 10',
      [userId]
    );

    console.log('📊 Recent Transactions:');
    console.log('========================\n');
    
    if (transactions.length === 0) {
      console.log('No transactions found');
    } else {
      transactions.forEach((tx, index) => {
        console.log(`${index + 1}. ${tx.type.toUpperCase()}`);
        console.log(`   Amount: ₦${tx.amount}`);
        console.log(`   Status: ${tx.status}`);
        console.log(`   Date: ${tx.createdAt}`);
        console.log(`   ID: ${tx.id}\n`);
      });
    }

    // Get contributions
    const [contributions] = await connection.query(
      'SELECT id, type, amount, contribution_date, year, month, createdAt FROM contributions WHERE userId = ? ORDER BY createdAt DESC LIMIT 10',
      [userId]
    );

    console.log('\n📈 Recent Contributions:');
    console.log('========================\n');
    
    if (contributions.length === 0) {
      console.log('No contributions found');
    } else {
      contributions.forEach((contrib, index) => {
        console.log(`${index + 1}. ${contrib.type}`);
        console.log(`   Amount: ₦${contrib.amount}`);
        console.log(`   Date: ${contrib.contribution_date || contrib.createdAt}`);
        console.log(`   Year/Month: ${contrib.year}/${contrib.month}`);
        console.log(`   ID: ${contrib.id}\n`);
      });
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkTransactions();
