const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function fixSubscribersPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Connected to database\n');
    console.log('Fixing SUBSCRIBERS table passwords...\n');

    try {
        // Get all subscribers
        const [subscribers] = await connection.query('SELECT id, mobile, password FROM subscribers');
        console.log(`Found ${subscribers.length} subscribers`);
        
        let fixedCount = 0;
        const uniquePasswords = new Set();
        
        for (const sub of subscribers) {
            const isHashed = sub.password && sub.password.startsWith('$2');
            
            if (!isHashed) {
                console.log(`\nFixing subscriber ID: ${sub.id}`);
                console.log(`  Mobile: ${sub.mobile}`);
                console.log(`  Plain password: "${sub.password}"`);
                
                uniquePasswords.add(sub.password);
                
                const hashedPassword = await hashPassword(sub.password);
                console.log(`  Hashed: ${hashedPassword}`);
                
                await connection.query(
                    'UPDATE subscribers SET password = ? WHERE id = ?',
                    [hashedPassword, sub.id]
                );
                
                fixedCount++;
                console.log(`  ✅ Updated`);
            }
        }
        
        console.log('\n========== SUMMARY ==========');
        console.log(`Total subscribers: ${subscribers.length}`);
        console.log(`Fixed passwords: ${fixedCount}`);
        console.log(`Unique plain passwords found: ${uniquePasswords.size}`);
        
        if (uniquePasswords.size > 0) {
            console.log('\n📝 Plain text passwords that were found:');
            uniquePasswords.forEach(pwd => {
                console.log(`  "${pwd}"`);
            });
        }
        
        // Verify the fix
        console.log('\n========== VERIFICATION ==========');
        const [verifySubscribers] = await connection.query('SELECT id, mobile, password FROM subscribers');
        let stillPlain = 0;
        
        verifySubscribers.forEach(sub => {
            const isHashed = sub.password && sub.password.startsWith('$2');
            if (!isHashed) {
                stillPlain++;
                console.log(`❌ Still plain: ${sub.mobile}`);
            }
        });
        
        if (stillPlain === 0) {
            console.log('✅ ALL PASSWORDS IN SUBSCRIBERS TABLE ARE NOW HASHED!');
        } else {
            console.log(`❌ ${stillPlain} passwords still need fixing`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixSubscribersPasswords();
