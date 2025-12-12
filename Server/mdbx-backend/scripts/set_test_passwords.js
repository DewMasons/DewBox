const pool = require('../src/db');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function setTestPasswords() {
    console.log('Setting known passwords for test accounts...\n');
    
    const testAccounts = [
        { mobile: '2348012345678', password: 'Test123!', name: 'John Doe' },
        { mobile: '2348087654321', password: 'Test123!', name: 'Jane Smith' },
        { mobile: '2348098765432', password: 'Test123!', name: 'Michael Johnson' },
    ];
    
    try {
        for (const account of testAccounts) {
            console.log(`Setting password for ${account.name} (${account.mobile})...`);
            
            const hashedPassword = await hashPassword(account.password);
            
            // Update user table
            await pool.query('UPDATE user SET password = ? WHERE mobile = ?', [hashedPassword, account.mobile]);
            
            // Update users table
            await pool.query('UPDATE users SET password = ? WHERE mobile = ?', [hashedPassword, account.mobile]);
            
            // Update subscribers table
            await pool.query('UPDATE subscribers SET password = ? WHERE mobile = ?', [hashedPassword, account.mobile]);
            
            console.log(`  ✅ Password set to: ${account.password}\n`);
        }
        
        console.log('✅ All test account passwords updated!');
        console.log('\nYou can now login with:');
        testAccounts.forEach(acc => {
            console.log(`  Mobile: ${acc.mobile} | Password: ${acc.password}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

setTestPasswords();
