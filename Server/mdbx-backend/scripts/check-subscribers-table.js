require('dotenv').config();
const pool = require('../src/db');

async function checkTable() {
  try {
    console.log('🔍 Checking subscribers table structure...\n');
    
    const [columns] = await pool.query('DESCRIBE subscribers');
    
    console.log('📋 Subscribers table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTable();
