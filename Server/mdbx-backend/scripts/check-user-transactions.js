const pool = require('../src/db');

async function checkUserTransactions() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Check transactions for specific users
    const testEmails = [
      'joshuaoludimutric007@gmail.com',
      'hakeem.oludimu@gmail.com'
    ];
    
    for (const email of testEmails) {
      console.log(`\n📧 Checking transactions for: ${email}`);
      console.log('='.repeat(60));
      
      // Get user ID
      const [users] = await pool.query('SELECT id, name, email, mobile FROM user WHERE email = ?', [email]);
      
      if (users.length === 0) {
        console.log('❌ User not found');
        continue;
      }
      
      const user = users[0];
      console.log('✅ User found:', {
        id: user.id,
        name: user.name,
        mobile: user.mobile
      });
      
      // Get transactions
      const [transactions] = await pool.query(
        'SELECT * FROM transaction WHERE userId = ? ORDER BY createdAt DESC LIMIT 10',
        [user.id]
      );
      
      console.log(`\n📊 Transactions (${transactions.length}):`);
      transactions.forEach((t, i) => {
        console.log(`${i + 1}. ${t.type} - ₦${t.amount} - ${t.status} - ${new Date(t.createdAt).toLocaleString()}`);
      });
      
      // Get contributions
      const [contributions] = await pool.query(
        'SELECT * FROM contributions WHERE userId = ? ORDER BY contribution_date DESC LIMIT 10',
        [user.id]
      );
      
      console.log(`\n📈 Contributions (${contributions.length}):`);
      contributions.forEach((c, i) => {
        console.log(`${i + 1}. ${c.contribution_type} - ₦${c.amount} - ${new Date(c.contribution_date).toLocaleString()}`);
      });
    }
    
    await pool.end();
    console.log('\n🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserTransactions();
