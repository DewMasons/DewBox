const pool = require('../src/db');

async function checkUnhashedPasswords() {
    console.log('Checking for unhashed passwords...\n');
    
    try {
        const [users] = await pool.query('SELECT * FROM user LIMIT 1');
        
        if (users.length > 0) {
            console.log('Available columns:', Object.keys(users[0]));
        }
        
        const [allUsers] = await pool.query('SELECT id, mobile, password FROM user');
        
        console.log(`Total users found: ${allUsers.length}\n`);
        
        const unhashedUsers = [];
        const hashedUsers = [];
        
        allUsers.forEach(user => {
            const isHashed = user.password && user.password.startsWith('$2');
            
            if (!isHashed) {
                unhashedUsers.push(user);
                console.log('❌ UNHASHED PASSWORD FOUND:');
                console.log(`   ID: ${user.id}`);
                console.log(`   Mobile: ${user.mobile}`);
                console.log(`   Plain Password: "${user.password}"`);
                console.log('');
            } else {
                hashedUsers.push(user);
            }
        });
        
        console.log('\n=== SUMMARY ===');
        console.log(`✅ Properly hashed: ${hashedUsers.length}`);
        console.log(`❌ Unhashed (needs fixing): ${unhashedUsers.length}`);
        
        if (unhashedUsers.length > 0) {
            console.log('\n📝 Plain text passwords found:');
            unhashedUsers.forEach(u => {
                console.log(`   ${u.mobile}: "${u.password}"`);
            });
        }
        
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

checkUnhashedPasswords();
