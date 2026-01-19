const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  console.log('🔄 Starting database migrations...\n');

  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('✅ Connected to database\n');

  const migrations = [
    {
      name: 'Add LGA and Esusu columns',
      file: 'add-lga-esusu-columns.sql'
    },
    {
      name: 'Setup Audit Logging',
      file: 'setup-audit-logging.sql'
    }
  ];

  for (const migration of migrations) {
    try {
      console.log(`📝 Running: ${migration.name}...`);
      
      const sqlPath = path.join(__dirname, migration.file);
      const sql = await fs.readFile(sqlPath, 'utf8');
      
      await connection.query(sql);
      
      console.log(`✅ ${migration.name} - SUCCESS\n`);
    } catch (error) {
      console.error(`❌ ${migration.name} - FAILED`);
      console.error(`   Error: ${error.message}\n`);
      
      // Continue with other migrations even if one fails
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log(`   ℹ️  Column already exists, skipping...\n`);
      }
    }
  }

  await connection.end();
  console.log('✅ All migrations completed!\n');
}

runMigrations().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
