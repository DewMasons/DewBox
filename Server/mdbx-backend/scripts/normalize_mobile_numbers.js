const pool = require('../src/db');

function normalizeMobile(mobile) {
    if (!mobile) return mobile;
    
    // Remove all non-numeric characters
    mobile = mobile.replace(/\D/g, '');
    
    // If it starts with 0, replace with 234
    if (mobile.startsWith('0')) {
        mobile = '234' + mobile.slice(1);
    }
    // If it doesn't start with 234 and is 10 digits, add 234
    if (!mobile.startsWith('234') && mobile.length === 10) {
        mobile = '234' + mobile;
    }
    
    return mobile;
}

async function normalizeMobileNumbers() {
    console.log('Normalizing mobile numbers to 234XXXXXXXXXX format...\n');
    
    try {
        // Normalize user table
        console.log('=== USER TABLE ===');
        const [users] = await pool.query('SELECT id, mobile, name FROM user');
        
        for (const user of users) {
            const oldMobile = user.mobile;
            const newMobile = normalizeMobile(oldMobile);
            
            if (oldMobile !== newMobile) {
                console.log(`${user.name}:`);
                console.log(`  Old: ${oldMobile}`);
                console.log(`  New: ${newMobile}`);
                
                await pool.query('UPDATE user SET mobile = ? WHERE id = ?', [newMobile, user.id]);
                console.log('  ✅ Updated\n');
            } else {
                console.log(`${user.name}: ${oldMobile} (already normalized)`);
            }
        }
        
        // Normalize users table (plural)
        console.log('\n=== USERS TABLE ===');
        const [usersPlural] = await pool.query('SELECT id, mobile FROM users');
        
        for (const user of usersPlural) {
            const oldMobile = user.mobile;
            const newMobile = normalizeMobile(oldMobile);
            
            if (oldMobile !== newMobile) {
                console.log(`ID ${user.id}:`);
                console.log(`  Old: ${oldMobile}`);
                console.log(`  New: ${newMobile}`);
                
                await pool.query('UPDATE users SET mobile = ? WHERE id = ?', [newMobile, user.id]);
                console.log('  ✅ Updated\n');
            }
        }
        
        // Normalize subscribers table
        console.log('\n=== SUBSCRIBERS TABLE ===');
        const [subscribers] = await pool.query('SELECT id, mobile FROM subscribers');
        
        for (const sub of subscribers) {
            const oldMobile = sub.mobile;
            const newMobile = normalizeMobile(oldMobile);
            
            if (oldMobile !== newMobile) {
                console.log(`ID ${sub.id}:`);
                console.log(`  Old: ${oldMobile}`);
                console.log(`  New: ${newMobile}`);
                
                await pool.query('UPDATE subscribers SET mobile = ? WHERE id = ?', [newMobile, sub.id]);
                console.log('  ✅ Updated\n');
            }
        }
        
        console.log('\n✅ Mobile number normalization complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

normalizeMobileNumbers();
