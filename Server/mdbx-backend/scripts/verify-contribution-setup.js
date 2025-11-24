const pool = require('../src/db');

async function verifySetup() {
  try {
    console.log('🔍 Verifying contribution system setup...\n');

    // Check subscribers table columns
    const [subCols] = await pool.query('DESCRIBE subscribers');
    const hasMode = subCols.some(c => c.Field === 'contribution_mode');
    const hasICA = subCols.some(c => c.Field === 'ica_balance');
    const hasPiggy = subCols.some(c => c.Field === 'piggy_balance');

    console.log('Subscribers table:');
    console.log('  contribution_mode:', hasMode ? '✅' : '❌');
    console.log('  ica_balance:', hasICA ? '✅' : '❌');
    console.log('  piggy_balance:', hasPiggy ? '✅' : '❌');

    // Check contributions table
    const [tables] = await pool.query("SHOW TABLES LIKE 'contributions'");
    console.log('\nContributions table:', tables.length > 0 ? '✅' : '❌');

    const allGood = hasMode && hasICA && hasPiggy && tables.length > 0;
    console.log('\n' + (allGood ? '✅ All set up correctly!' : '❌ Setup incomplete'));

    if (allGood) {
      console.log('\n🎉 Contribution system is ready to use!');
      console.log('\nNext steps:');
      console.log('1. Set ADMIN_USER_ID in .env');
      console.log('2. Restart your server');
      console.log('3. Test the contribution endpoints');
    }

    process.exit(allGood ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySetup();
