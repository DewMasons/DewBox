const pool = require('../src/db');

async function addRegistrationDate() {
    console.log('Adding registration date columns...\n');
    
    try {
        // Add createdAt to user table
        console.log('1. Checking if createdAt exists in user table...');
        const [userCols] = await pool.query('SHOW COLUMNS FROM user LIKE "createdAt"');
        
        if (userCols.length === 0) {
            console.log('Adding createdAt to user table...');
            await pool.query(`
                ALTER TABLE user 
                ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            console.log('✅ Added createdAt to user table');
        } else {
            console.log('✅ createdAt already exists in user table');
        }
        
        // Add createdAt to subscribers table
        console.log('\n2. Checking if createdAt exists in subscribers table...');
        const [subCols] = await pool.query('SHOW COLUMNS FROM subscribers LIKE "createdAt"');
        
        if (subCols.length === 0) {
            console.log('Adding createdAt to subscribers table...');
            await pool.query(`
                ALTER TABLE subscribers 
                ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            console.log('✅ Added createdAt to subscribers table');
        } else {
            console.log('✅ createdAt already exists in subscribers table');
        }
        
        // Update existing records with current timestamp (they'll need manual correction if needed)
        console.log('\n3. Checking existing records...');
        const [users] = await pool.query('SELECT id, name, mobile, createdAt FROM user');
        console.log(`Found ${users.length} users`);
        
        users.forEach(u => {
            console.log(`  ${u.name} (${u.mobile}) - Registered: ${u.createdAt || 'Just now'}`);
        });
        
        console.log('\n✅ Registration date columns added successfully!');
        console.log('\nNote: Existing users will have today\'s date. You may need to manually update their registration dates if needed.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addRegistrationDate();
