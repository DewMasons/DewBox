const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function setupContributionSystem() {
  try {
    console.log('🚀 Setting up contribution system...\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-contribution-system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        const [result] = await pool.query(statement);
        if (result && result[0]) {
          console.log('✅', result[0]);
        }
      } catch (err) {
        // Ignore "column already exists" errors
        if (!err.message.includes('Duplicate column')) {
          console.error('❌ Error:', err.message);
        }
      }
    }

    console.log('\n✅ Contribution system setup completed!');
    console.log('\n📋 System Details:');
    console.log('   - ICA Period: Days 2-11 of each month');
    console.log('   - Piggy Period: Days 12-31 of each month');
    console.log('   - ICA: Yearly commitment with interest, transfers to admin');
    console.log('   - Piggy: Monthly savings, stays in user wallet');
    console.log('\n🔧 Next Steps:');
    console.log('   1. Set ADMIN_USER_ID in .env file');
    console.log('   2. Test contribution endpoints');
    console.log('   3. Use admin routes to manage system\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupContributionSystem();
