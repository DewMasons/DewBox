const pool = require('../src/db');

async function createContributionsTable() {
  try {
    console.log('🚀 Creating contributions table...\n');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS contributions (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        type ENUM('ICA', 'PIGGY') NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
        contribution_date DATE NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        interest_earned DECIMAL(10, 2) DEFAULT 0.00,
        description TEXT,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
        INDEX idx_user_type (userId, type),
        INDEX idx_date (contribution_date),
        INDEX idx_year_month (year, month)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `;

    await pool.query(createTableSQL);
    console.log('✅ Contributions table created successfully!');

    // Verify table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'contributions'");
    if (tables.length > 0) {
      console.log('✅ Table verified in database');
      
      // Show table structure
      const [columns] = await pool.query('DESCRIBE contributions');
      console.log('\n📋 Table Structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
    }

    console.log('\n✅ Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createContributionsTable();
