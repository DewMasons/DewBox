const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyMigrations() {
  console.log('🔍 Verifying database migrations...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Check subscribers table
  console.log('📋 Subscribers table columns:');
  const [subscriberCols] = await connection.query('DESCRIBE subscribers');
  const lgaCol = subscriberCols.find(c => c.Field === 'lga');
  const esusuCol = subscriberCols.find(c => c.Field === 'joinEsusu');
  
  if (lgaCol) {
    console.log(`  ✅ lga column exists (${lgaCol.Type})`);
  } else {
    console.log('  ❌ lga column NOT found');
  }
  
  if (esusuCol) {
    console.log(`  ✅ joinEsusu column exists (${esusuCol.Type})`);
  } else {
    console.log('  ❌ joinEsusu column NOT found');
  }

  // Check audit tables
  console.log('\n📋 Audit system tables:');
  
  const auditTables = ['audit_log', 'data_breaches', 'user_consents', 'session_logs', 'transaction_archive'];
  
  for (const tableName of auditTables) {
    const [result] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
    if (result.length > 0) {
      console.log(`  ✅ ${tableName} table exists`);
    } else {
      console.log(`  ❌ ${tableName} table NOT found`);
    }
  }

  // Check user table audit columns
  console.log('\n📋 User table audit columns:');
  const [userCols] = await connection.query('DESCRIBE user');
  const auditCols = ['failed_login_attempts', 'last_failed_login', 'account_locked', 'last_login', 'deleted_at'];
  
  for (const colName of auditCols) {
    const col = userCols.find(c => c.Field === colName);
    if (col) {
      console.log(`  ✅ ${colName} exists`);
    } else {
      console.log(`  ❌ ${colName} NOT found`);
    }
  }

  await connection.end();
  console.log('\n✅ Verification complete!\n');
}

verifyMigrations().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
