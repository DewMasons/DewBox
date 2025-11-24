const pool = require('../src/db');

async function updateTransactionTypes() {
  try {
    console.log('🚀 Updating transaction table types...\n');

    // Update the type column to include all contribution types
    await pool.query(`
      ALTER TABLE transaction 
      MODIFY COLUMN type ENUM(
        'contribution',
        'withdrawal',
        'transfer',
        'wallet_transfer',
        'ica',
        'piggy'
      ) NOT NULL
    `);

    console.log('✅ Transaction types updated successfully!');

    // Verify the change
    const [cols] = await pool.query('DESCRIBE transaction');
    const typeCol = cols.find(c => c.Field === 'type');
    console.log('\n📋 Updated type column:');
    console.log('   ', typeCol.Type);

    console.log('\n✅ Transaction table is ready for contributions!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateTransactionTypes();
