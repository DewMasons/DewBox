const pool = require('../src/db');

async function addDepositFeeTypes() {
  try {
    console.log('🚀 Adding deposit and fee types to transaction table...\n');

    await pool.query(`
      ALTER TABLE transaction 
      MODIFY COLUMN type ENUM(
        'contribution',
        'withdrawal',
        'transfer',
        'wallet_transfer',
        'ica',
        'piggy',
        'deposit',
        'fee'
      ) NOT NULL
    `);

    console.log('✅ Transaction types updated successfully!');

    // Verify
    const [cols] = await pool.query('DESCRIBE transaction');
    const typeCol = cols.find(c => c.Field === 'type');
    console.log('\n📋 Updated type column:');
    console.log('   ', typeCol.Type);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addDepositFeeTypes();
