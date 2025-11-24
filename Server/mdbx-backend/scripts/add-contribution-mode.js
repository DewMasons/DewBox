const pool = require('../src/db');

async function addContributionMode() {
  try {
    console.log('🚀 Adding contribution_mode column...\n');

    await pool.query(`
      ALTER TABLE subscribers 
      ADD COLUMN contribution_mode ENUM('auto', 'all_ica') DEFAULT 'auto'
    `);

    console.log('✅ contribution_mode column added successfully!');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column')) {
      console.log('✅ contribution_mode column already exists');
      process.exit(0);
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

addContributionMode();
